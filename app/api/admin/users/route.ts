import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';

// GET all users (admin only - uses Firebase Admin SDK which bypasses security rules)
// This fetches from BOTH Firebase Auth AND Firestore users collection
export async function GET(request: NextRequest) {
  try {
    console.log('[AdminUsersAPI] Fetching all users...');
    
    // Step 1: Get all users from Firebase Authentication
    const authUsers: any[] = [];
    let nextPageToken: string | undefined;
    
    do {
      const listResult = await auth.listUsers(1000, nextPageToken);
      listResult.users.forEach((userRecord) => {
        authUsers.push({
          uid: userRecord.uid,
          email: userRecord.email || 'N/A',
          displayName: userRecord.displayName || null,
          createdAt: userRecord.metadata.creationTime || null,
          lastSignIn: userRecord.metadata.lastSignInTime || null,
          emailVerified: userRecord.emailVerified,
          disabled: userRecord.disabled,
          isAdmin: userRecord.customClaims?.admin || false,
        });
      });
      nextPageToken = listResult.pageToken;
    } while (nextPageToken);
    
    console.log('[AdminUsersAPI] Found', authUsers.length, 'users in Firebase Auth');
    
    // Step 2: Get all users from Firestore
    const firestoreUsers: Map<string, any> = new Map();
    const usersSnapshot = await db.collection('users').get();
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      firestoreUsers.set(doc.id, {
        id: doc.id,
        email: data.email || 'N/A',
        displayName: data.displayName || null,
        country: data.country || null,
        createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : null,
        isAdmin: data.isAdmin || false,
        requiresPasswordChange: data.requiresPasswordChange || false,
        kycStatus: data.kycStatus || 'pending',
        accounts: data.accounts || [],
      });
    });
    
    console.log('[AdminUsersAPI] Found', firestoreUsers.size, 'users in Firestore');
    
    // Step 3: Merge Auth users with Firestore data
    const mergedUsers: any[] = [];
    const missingFirestoreDocs: string[] = [];
    
    for (const authUser of authUsers) {
      const firestoreData = firestoreUsers.get(authUser.uid);
      
      if (firestoreData) {
        // User exists in both Auth and Firestore - merge data
        mergedUsers.push({
          id: authUser.uid,
          email: authUser.email,
          displayName: firestoreData.displayName || authUser.displayName,
          country: firestoreData.country,
          createdAt: firestoreData.createdAt || authUser.createdAt,
          isAdmin: firestoreData.isAdmin || authUser.isAdmin,
          requiresPasswordChange: firestoreData.requiresPasswordChange,
          kycStatus: firestoreData.kycStatus,
          accounts: firestoreData.accounts,
          hasFirestoreDoc: true,
          lastSignIn: authUser.lastSignIn,
        });
        // Remove from map to track processed users
        firestoreUsers.delete(authUser.uid);
      } else {
        // User exists in Auth but NOT in Firestore
        console.log('[AdminUsersAPI] User missing Firestore doc:', authUser.email);
        missingFirestoreDocs.push(authUser.uid);
        mergedUsers.push({
          id: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          country: null,
          createdAt: authUser.createdAt,
          isAdmin: authUser.isAdmin,
          requiresPasswordChange: false,
          kycStatus: 'pending',
          accounts: [],
          hasFirestoreDoc: false, // Flag to indicate missing Firestore doc
          lastSignIn: authUser.lastSignIn,
        });
      }
    }
    
    // Step 4: Add any Firestore users not in Auth (orphaned docs - rare but possible)
    firestoreUsers.forEach((firestoreUser, id) => {
      console.log('[AdminUsersAPI] Orphaned Firestore doc (no Auth):', firestoreUser.email);
      mergedUsers.push({
        ...firestoreUser,
        hasFirestoreDoc: true,
        hasAuthAccount: false, // Flag to indicate no Auth account
      });
    });
    
    // Sort by createdAt descending (newest first)
    mergedUsers.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    console.log('[AdminUsersAPI] Returning', mergedUsers.length, 'total users');
    console.log('[AdminUsersAPI] Users missing Firestore docs:', missingFirestoreDocs.length);
    
    return NextResponse.json({ 
      users: mergedUsers, 
      total: mergedUsers.length,
      authCount: authUsers.length,
      firestoreCount: usersSnapshot.size,
      missingFirestoreDocs: missingFirestoreDocs.length
    });
  } catch (error: any) {
    console.error('[AdminUsersAPI] Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create missing Firestore documents for Auth users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, email, displayName } = body;
    
    if (action === 'createFirestoreDoc') {
      // Create Firestore document for an Auth user that's missing one
      console.log('[AdminUsersAPI] Creating Firestore doc for:', email);
      
      await db.collection('users').doc(userId).set({
        uid: userId,
        email: email,
        displayName: displayName || email.split('@')[0],
        country: 'Unknown',
        createdAt: new Date(),
        accounts: [],
        kycStatus: 'pending',
        isAdmin: false,
        requiresPasswordChange: true,
      });
      
      return NextResponse.json({ success: true, message: 'Firestore document created' });
    }
    
    if (action === 'syncAllMissing') {
      // Sync all Auth users that are missing Firestore docs
      console.log('[AdminUsersAPI] Syncing all missing Firestore docs...');
      
      // Get all Auth users
      const authUsers: any[] = [];
      let nextPageToken: string | undefined;
      
      do {
        const listResult = await auth.listUsers(1000, nextPageToken);
        listResult.users.forEach((userRecord) => {
          authUsers.push(userRecord);
        });
        nextPageToken = listResult.pageToken;
      } while (nextPageToken);
      
      // Get all Firestore user IDs
      const firestoreSnapshot = await db.collection('users').get();
      const firestoreUserIds = new Set(firestoreSnapshot.docs.map(doc => doc.id));
      
      // Create missing docs
      let created = 0;
      for (const authUser of authUsers) {
        if (!firestoreUserIds.has(authUser.uid)) {
          await db.collection('users').doc(authUser.uid).set({
            uid: authUser.uid,
            email: authUser.email || 'N/A',
            displayName: authUser.displayName || (authUser.email ? authUser.email.split('@')[0] : 'User'),
            country: 'Unknown',
            createdAt: authUser.metadata.creationTime ? new Date(authUser.metadata.creationTime) : new Date(),
            accounts: [],
            kycStatus: 'pending',
            isAdmin: false,
            requiresPasswordChange: true,
          });
          created++;
          console.log('[AdminUsersAPI] Created Firestore doc for:', authUser.email);
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Created ${created} missing Firestore documents`,
        created 
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[AdminUsersAPI] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Operation failed' },
      { status: 500 }
    );
  }
}

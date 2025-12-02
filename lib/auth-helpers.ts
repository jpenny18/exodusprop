// Authentication and data helper functions with Firebase
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  country: string;
  createdAt: string;
  accounts: string[];
  kycStatus: 'pending' | 'approved' | 'rejected';
  isAdmin: boolean;
  walletAddress?: string;
  requiresPasswordChange?: boolean;
}

export interface Account {
  id: string;
  userId: string;
  accountSize: string;
  accountType: string;
  platform?: 'MT4' | 'MT5';
  status: 'active' | 'inactive' | 'breached' | 'pending';
  balance: number;
  profit: number;
  startDate: string;
  credentials?: {
    login: string;
    password: string;
    server: string;
  };
  planId?: string;
  receiptId?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  email: string;
  accountSize: string;
  accountPrice: number;
  platform: 'MT4' | 'MT5';
  planId: string;
  receiptId?: string;
  billingInfo: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  timestamp: string;
  status: 'pending' | 'completed';
}

export interface Payout {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  walletAddress: string;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: string;
}

// Create new user account
export async function createUser(userData: {
  email: string;
  password: string;
  displayName: string;
  country: string;
  requiresPasswordChange?: boolean;
}): Promise<FirebaseUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: userData.email,
      displayName: userData.displayName,
      country: userData.country,
      createdAt: serverTimestamp(),
      accounts: [],
      kycStatus: 'pending',
      isAdmin: false,
      requiresPasswordChange: userData.requiresPasswordChange || false,
    });

    return userCredential.user;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(error.message || 'Failed to create user');
  }
}

// Sign in user
export async function signIn(email: string, password: string): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

// Sign out user
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
}

// Get user data from Firestore
export async function getUser(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Check if user exists by email
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user exists:', error);
    return false;
  }
}

// Save purchase to database
export async function savePurchase(purchaseData: Omit<Purchase, 'id'>): Promise<string> {
  try {
    const purchasesRef = collection(db, 'purchases');
    const docRef = await addDoc(purchasesRef, {
      ...purchaseData,
      timestamp: serverTimestamp(),
    });
    
    // Note: Trading accounts will be created manually by admin
    // No automatic MT5 account creation since we don't have broker APIs

    return docRef.id;
  } catch (error) {
    console.error('Error saving purchase:', error);
    throw new Error('Failed to save purchase');
  }
}

// Create trading account (with or without credentials)
// Called after purchase (pending) or by admin when adding credentials (active)
export async function createTradingAccount(accountData: {
  userId: string;
  accountSize: string;
  accountType: string;
  platform?: 'MT4' | 'MT5';
  planId?: string;
  receiptId?: string;
  credentials?: {
    login: string;
    password: string;
    server: string;
  };
}): Promise<string> {
  try {
    const accountsRef = collection(db, 'accounts');
    
    const initialBalance = parseInt(accountData.accountSize.replace(/[$,]/g, ''));
    
    const docRef = await addDoc(accountsRef, {
      userId: accountData.userId,
      accountSize: accountData.accountSize,
      accountType: accountData.accountType,
      platform: accountData.platform || null,
      status: accountData.credentials ? 'active' : 'pending', // Pending until admin adds credentials
      balance: initialBalance,
      profit: 0,
      startDate: serverTimestamp(),
      credentials: accountData.credentials || null,
      planId: accountData.planId,
      receiptId: accountData.receiptId,
    });

    // Add account ID to user's accounts array
    const userRef = doc(db, 'users', accountData.userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const currentAccounts = userDoc.data().accounts || [];
      await updateDoc(userRef, {
        accounts: [...currentAccounts, docRef.id]
      });
    }

    return docRef.id;
  } catch (error) {
    console.error('Error creating trading account:', error);
    throw new Error('Failed to create trading account');
  }
}

// Get user accounts
export async function getUserAccounts(userId: string): Promise<Account[]> {
  try {
    const accountsRef = collection(db, 'accounts');
    const q = query(accountsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Account));
  } catch (error) {
    console.error('Error getting user accounts:', error);
    return [];
  }
}

// Submit KYC documents
export async function submitKYC(
  userId: string,
  documents: {
    idFront: File;
    idBack: File;
    proofOfAddress: File;
  }
): Promise<void> {
  try {
    // Upload documents to Firebase Storage
    const uploads = await Promise.all([
      uploadFile(`kyc/${userId}/id-front`, documents.idFront),
      uploadFile(`kyc/${userId}/id-back`, documents.idBack),
      uploadFile(`kyc/${userId}/proof-of-address`, documents.proofOfAddress),
    ]);

    // Update user KYC status
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      kycStatus: 'submitted',
      kycDocuments: {
        idFront: uploads[0],
        idBack: uploads[1],
        proofOfAddress: uploads[2],
      },
      kycSubmittedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error submitting KYC:', error);
    throw new Error('Failed to submit KYC documents');
  }
}

// Upload file to Storage
async function uploadFile(path: string, file: File): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Submit payout request
export async function submitPayout(payoutData: Omit<Payout, 'id'>): Promise<string> {
  try {
    const payoutsRef = collection(db, 'payouts');
    const docRef = await addDoc(payoutsRef, {
      ...payoutData,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting payout:', error);
    throw new Error('Failed to submit payout request');
  }
}

// Get user payouts
export async function getUserPayouts(userId: string): Promise<Payout[]> {
  try {
    const payoutsRef = collection(db, 'payouts');
    const q = query(payoutsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Payout));
  } catch (error) {
    console.error('Error getting user payouts:', error);
    return [];
  }
}

// Update user settings
export async function updateUserSettings(
  userId: string,
  settings: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, settings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw new Error('Failed to update settings');
  }
}

// Update user password
export async function updateUserPassword(newPassword: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    const { updatePassword } = await import('firebase/auth');
    await updatePassword(user, newPassword);
    
    // Clear requiresPasswordChange flag
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      requiresPasswordChange: false,
    });
  } catch (error: any) {
    console.error('Error updating password:', error);
    throw new Error(error.message || 'Failed to update password');
  }
}

// ==================== ADMIN FUNCTIONS ====================

// Get all users (admin only)
export async function getAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id,
    } as User));
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// Get all purchases (admin only)
export async function getAllPurchases(): Promise<Purchase[]> {
  try {
    const purchasesRef = collection(db, 'purchases');
    const querySnapshot = await getDocs(purchasesRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Purchase));
  } catch (error) {
    console.error('Error getting all purchases:', error);
    return [];
  }
}

// Get all accounts (admin only)
export async function getAllAccounts(): Promise<Account[]> {
  try {
    const accountsRef = collection(db, 'accounts');
    const querySnapshot = await getDocs(accountsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Account));
  } catch (error) {
    console.error('Error getting all accounts:', error);
    return [];
  }
}

// Get all payouts (admin only)
export async function getAllPayouts(): Promise<Payout[]> {
  try {
    const payoutsRef = collection(db, 'payouts');
    const querySnapshot = await getDocs(payoutsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Payout));
  } catch (error) {
    console.error('Error getting all payouts:', error);
    return [];
  }
}

// Get pending KYC submissions (admin only)
export async function getPendingKYC(): Promise<User[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('kycStatus', '==', 'submitted'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id,
    } as User));
  } catch (error) {
    console.error('Error getting pending KYC:', error);
    return [];
  }
}

// Update KYC status (admin only)
export async function updateKYCStatus(
  userId: string,
  status: 'approved' | 'rejected'
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      kycStatus: status,
      kycReviewedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating KYC status:', error);
    throw new Error('Failed to update KYC status');
  }
}

// Update payout status (admin only)
export async function updatePayoutStatus(
  payoutId: string,
  status: 'completed' | 'rejected'
): Promise<void> {
  try {
    const payoutRef = doc(db, 'payouts', payoutId);
    await updateDoc(payoutRef, {
      status,
      processedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating payout status:', error);
    throw new Error('Failed to update payout status');
  }
}

// Update account credentials (admin only)
export async function updateAccountCredentials(
  accountId: string,
  credentials: {
    login: string;
    password: string;
    server: string;
  }
): Promise<void> {
  try {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      credentials,
      status: 'active',
      credentialsAddedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating account credentials:', error);
    throw new Error('Failed to update account credentials');
  }
}

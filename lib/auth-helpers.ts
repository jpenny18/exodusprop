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
  firstName?: string;
  lastName?: string;
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
  // Legacy single account fields
  accountSize?: string;
  accountPrice?: number;
  platform?: 'MT4' | 'MT5';
  // New subscription fields
  subscriptionTier?: string;
  subscriptionPrice?: number;
  subscriptionPlanId?: string;
  accountsCount?: number;
  accounts?: Array<{
    platform: string;
    planType: string;
    accountBalance: string;
    accountBalanceValue: number;
  }>;
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
  paymentMethod?: 'card' | 'crypto';
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

// ==================== METAAPI INTEGRATION ====================

/**
 * Interface for MetaAPI account mapping
 */
export interface UserMetaApiAccount {
  userId: string;
  accountId: string;
  accountToken: string;
  accountType: '1-step' | 'elite';
  accountSize: number;
  platform: 'mt4' | 'mt5';
  status: 'active' | 'inactive' | 'passed' | 'failed' | 'funded';
  step: 1 | 2 | 3; // 1 = Challenge, 2 = Not used for 1-step/elite, 3 = Funded
  startDate: string;
  createdAt: string;
  updatedAt: string;
  lastMetricsUpdate?: string;
  trackerId?: string; // Risk management tracker ID
  fundedDate?: string; // Date when account became funded
  // Trading account login credentials
  login?: string;
  password?: string;
  server?: string;
  nickname?: string;
}

/**
 * Interface for cached MetaAPI metrics in Firestore
 */
export interface CachedMetrics {
  accountId: string;
  balance: number;
  equity: number;
  averageProfit: number;
  averageLoss: number;
  numberOfTrades: number;
  averageRRR: number;
  lots: number;
  expectancy: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  dailyDrawdown: number;
  maxDailyDrawdown: number;
  currentProfit: number;
  tradingDays: number;
  lastUpdated: string;
  accountName?: string;
  broker?: string;
  server?: string;
  wonTrades?: number;
  lostTrades?: number;
  lastTrades?: any[];
  lastEquityChart?: any[];
  lastObjectives?: any;
  lastRiskEvents?: any[];
  lastPeriodStats?: any[];
  lastTrackers?: any[];
}

/**
 * Get user's MetaAPI account mapping
 * @param userId The user ID
 * @param accountId Optional specific account ID to fetch
 */
export async function getUserMetaApiAccount(userId: string, accountId?: string): Promise<UserMetaApiAccount | null> {
  try {
    const accountsRef = collection(db, 'userMetaApiAccounts');
    
    if (accountId) {
      const q = query(
        accountsRef, 
        where('userId', '==', userId), 
        where('accountId', '==', accountId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as UserMetaApiAccount;
      }
      return null;
    }
    
    const q = query(accountsRef, where('userId', '==', userId), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserMetaApiAccount;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user MetaAPI account:', error);
    throw error;
  }
}

/**
 * Get all MetaAPI accounts for a user
 */
export async function getAllUserMetaApiAccounts(userId: string): Promise<UserMetaApiAccount[]> {
  try {
    const accountsRef = collection(db, 'userMetaApiAccounts');
    const q = query(accountsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const accounts: UserMetaApiAccount[] = [];
    querySnapshot.forEach((doc) => {
      accounts.push(doc.data() as UserMetaApiAccount);
    });
    
    return accounts;
  } catch (error) {
    console.error('Error fetching user MetaAPI accounts:', error);
    throw error;
  }
}

/**
 * Create or update user's MetaAPI account mapping
 */
export async function setUserMetaApiAccount(data: Omit<UserMetaApiAccount, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const accountsRef = collection(db, 'userMetaApiAccounts');
    
    const duplicateQuery = query(
      accountsRef, 
      where('userId', '==', data.userId),
      where('accountId', '==', data.accountId)
    );
    const duplicateSnapshot = await getDocs(duplicateQuery);
    
    if (!duplicateSnapshot.empty) {
      const docId = duplicateSnapshot.docs[0].id;
      await updateDoc(doc(db, 'userMetaApiAccounts', docId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } else {
      await addDoc(accountsRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error setting user MetaAPI account:', error);
    throw error;
  }
}

/**
 * Get cached metrics for an account
 */
export async function getCachedMetrics(accountId: string): Promise<CachedMetrics | null> {
  try {
    const metricsRef = doc(db, 'cachedMetrics', accountId);
    const metricsSnap = await getDoc(metricsRef);
    
    if (metricsSnap.exists()) {
      return metricsSnap.data() as CachedMetrics;
    }
    return null;
  } catch (error) {
    console.error('Error fetching cached metrics:', error);
    throw error;
  }
}

/**
 * Update cached metrics for an account
 */
export async function updateCachedMetrics(accountId: string, metrics: Omit<CachedMetrics, 'lastUpdated'>): Promise<void> {
  try {
    const metricsRef = doc(db, 'cachedMetrics', accountId);
    await setDoc(metricsRef, {
      ...metrics,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating cached metrics:', error);
    throw error;
  }
}

// ==================== KYC FUNCTIONS ====================

/**
 * Interface for KYC submission data
 */
export interface KYCSubmission {
  userId: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_resubmission';
  personalInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
  };
  documents: {
    governmentIdUrl?: string;
    governmentIdFileName?: string;
    proofOfAddressUrl?: string;
    proofOfAddressFileName?: string;
    tradingAgreementUrl?: string;
    tradingAgreementSignedAt?: string;
  };
  reviewNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  updatedAt: string;
}

/**
 * Create or update KYC submission
 * @param userId The user ID
 * @param kycData The KYC data
 * @returns The submission ID
 */
export async function createOrUpdateKYCSubmission(
  userId: string, 
  kycData: Partial<KYCSubmission>
): Promise<string> {
  try {
    const kycRef = doc(db, 'kycSubmissions', userId);
    const existingDoc = await getDoc(kycRef);
    
    if (existingDoc.exists()) {
      const existingData = existingDoc.data() as KYCSubmission;
      
      const mergedData: any = {
        ...kycData,
        updatedAt: new Date().toISOString()
      };
      
      if (kycData.documents) {
        mergedData.documents = {
          ...existingData.documents,
          ...kycData.documents
        };
      }
      
      await updateDoc(kycRef, mergedData);
      return userId;
    } else {
      await setDoc(kycRef, {
        userId,
        status: 'pending',
        ...kycData,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return userId;
    }
  } catch (error) {
    console.error('Error creating/updating KYC submission:', error);
    throw error;
  }
}

/**
 * Get KYC submission by user ID
 * @param userId The user ID
 * @returns The KYC submission data
 */
export async function getKYCSubmission(userId: string): Promise<KYCSubmission | null> {
  try {
    const kycRef = doc(db, 'kycSubmissions', userId);
    const kycSnap = await getDoc(kycRef);
    
    if (kycSnap.exists()) {
      return kycSnap.data() as KYCSubmission;
    }
    return null;
  } catch (error) {
    console.error('Error fetching KYC submission:', error);
    throw error;
  }
}

/**
 * Get all KYC submissions (admin only)
 * @param statusFilter Optional status filter
 * @returns Array of KYC submissions
 */
export async function getAllKYCSubmissions(
  statusFilter?: KYCSubmission['status']
): Promise<(KYCSubmission & { id: string })[]> {
  try {
    const kycRef = collection(db, 'kycSubmissions');
    let q = query(kycRef);
    
    if (statusFilter) {
      q = query(kycRef, where('status', '==', statusFilter));
    }
    
    const querySnapshot = await getDocs(q);
    const submissions: (KYCSubmission & { id: string })[] = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push({ 
        ...(doc.data() as KYCSubmission), 
        id: doc.id 
      });
    });
    
    return submissions;
  } catch (error) {
    console.error('Error fetching KYC submissions:', error);
    throw error;
  }
}

/**
 * Update KYC submission status (admin only)
 * @param userId The user ID
 * @param status The new status
 * @param reviewNotes Optional review notes
 * @param reviewedBy The reviewer's ID
 */
export async function updateKYCSubmissionStatus(
  userId: string,
  status: KYCSubmission['status'],
  reviewNotes?: string,
  reviewedBy?: string
): Promise<void> {
  try {
    const kycRef = doc(db, 'kycSubmissions', userId);
    const updateData: Partial<KYCSubmission> = {
      status,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }
    
    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
    }
    
    await updateDoc(kycRef, updateData);
    
    if (status === 'approved') {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        kycStatus: 'approved',
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating KYC status:', error);
    throw error;
  }
}

// ==================== WITHDRAWAL FUNCTIONS ====================

/**
 * Interface for withdrawal request data
 */
export interface WithdrawalRequest {
  userId: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  amountOwed: number;
  profitSplit: number;
  payoutAmount: number;
  paymentMethod: 'usdc_solana' | 'usdt_trc20';
  walletAddress?: string;
  transactionHash?: string;
  submittedAt?: string;
  enabledAt: string;
  enabledBy: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Enable withdrawal for a user (admin only)
 * @param userId The user ID
 * @param userEmail The user's email
 * @param amountOwed Total amount owed to the user
 * @param profitSplit Profit split percentage
 * @param enabledBy Admin user ID who enabled
 */
export async function enableUserWithdrawal(
  userId: string,
  userEmail: string,
  amountOwed: number,
  profitSplit: number,
  enabledBy: string
): Promise<string> {
  try {
    const withdrawalRef = doc(db, 'withdrawalRequests', userId);
    const payoutAmount = (amountOwed * profitSplit) / 100;
    
    await setDoc(withdrawalRef, {
      userId,
      userEmail,
      status: 'pending',
      amountOwed,
      profitSplit,
      payoutAmount,
      enabledAt: new Date().toISOString(),
      enabledBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return userId;
  } catch (error) {
    console.error('Error enabling withdrawal:', error);
    throw error;
  }
}

/**
 * Get withdrawal request by user ID
 * @param userId The user ID
 * @returns The withdrawal request data
 */
export async function getWithdrawalRequest(userId: string): Promise<WithdrawalRequest | null> {
  try {
    const withdrawalRef = doc(db, 'withdrawalRequests', userId);
    const withdrawalSnap = await getDoc(withdrawalRef);
    
    if (withdrawalSnap.exists()) {
      return withdrawalSnap.data() as WithdrawalRequest;
    }
    return null;
  } catch (error) {
    console.error('Error fetching withdrawal request:', error);
    throw error;
  }
}

/**
 * Update withdrawal request (user submitting wallet details)
 * @param userId The user ID
 * @param paymentMethod Payment method chosen
 * @param walletAddress Wallet address
 */
export async function submitWithdrawalDetails(
  userId: string,
  paymentMethod: 'usdc_solana' | 'usdt_trc20',
  walletAddress: string
): Promise<void> {
  try {
    const withdrawalRef = doc(db, 'withdrawalRequests', userId);
    await updateDoc(withdrawalRef, {
      paymentMethod,
      walletAddress,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting withdrawal details:', error);
    throw error;
  }
}

/**
 * Get all withdrawal requests (admin only)
 * @param statusFilter Optional status filter
 * @returns Array of withdrawal requests
 */
export async function getAllWithdrawalRequests(
  statusFilter?: WithdrawalRequest['status']
): Promise<(WithdrawalRequest & { id: string })[]> {
  try {
    const withdrawalsRef = collection(db, 'withdrawalRequests');
    let q = query(withdrawalsRef);
    
    if (statusFilter) {
      q = query(withdrawalsRef, where('status', '==', statusFilter));
    }
    
    const querySnapshot = await getDocs(q);
    const withdrawals: (WithdrawalRequest & { id: string })[] = [];
    
    querySnapshot.forEach((doc) => {
      withdrawals.push({ 
        ...(doc.data() as WithdrawalRequest), 
        id: doc.id 
      });
    });
    
    return withdrawals;
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    throw error;
  }
}

/**
 * Update withdrawal request status (admin only)
 * @param userId The user ID
 * @param status The new status
 * @param reviewNotes Optional review notes
 * @param reviewedBy The reviewer's ID
 * @param transactionHash Optional transaction hash for completed withdrawals
 */
export async function updateWithdrawalRequestStatus(
  userId: string,
  status: WithdrawalRequest['status'],
  reviewNotes?: string,
  reviewedBy?: string,
  transactionHash?: string
): Promise<void> {
  try {
    const withdrawalRef = doc(db, 'withdrawalRequests', userId);
    const updateData: Partial<WithdrawalRequest> = {
      status,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }
    
    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
    }
    
    if (transactionHash) {
      updateData.transactionHash = transactionHash;
    }
    
    await updateDoc(withdrawalRef, updateData);
  } catch (error) {
    console.error('Error updating withdrawal status:', error);
    throw error;
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

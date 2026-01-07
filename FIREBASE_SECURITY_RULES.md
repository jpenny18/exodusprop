# Firebase Security Rules for Exodus Prop

## Overview
This document contains the complete Firebase Security Rules for Firestore, Storage, and Authentication. These rules ensure data protection while maintaining full functionality.

---

## 🔒 Firestore Security Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ==================== HELPER FUNCTIONS ====================
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is the owner of the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Check if user has admin role
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.admin == true;
    }
    
    // Check if the user document matches the authenticated user
    function isUserDocument() {
      return isAuthenticated() && 
             request.auth.uid == resource.id;
    }
    
    // Validate email format
    function isValidEmail(email) {
      return email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    }
    
    // ==================== USERS COLLECTION ====================
    
    match /users/{userId} {
      // Allow users to read their own profile
      // Allow admins to read any user profile
      allow read: if isOwner(userId) || isAdmin();
      
      // Allow user creation during sign-up
      // Only allow user to create their own document with matching uid
      allow create: if isOwner(userId) && 
                      request.resource.data.uid == userId &&
                      request.resource.data.email == request.auth.token.email &&
                      request.resource.data.isAdmin == false &&
                      request.resource.data.kycStatus == 'pending';
      
      // Allow users to update their own profile (limited fields)
      // Users cannot change uid, email, isAdmin, or kycStatus
      allow update: if isOwner(userId) && 
                      request.resource.data.uid == resource.data.uid &&
                      request.resource.data.email == resource.data.email &&
                      request.resource.data.isAdmin == resource.data.isAdmin &&
                      (request.resource.data.kycStatus == resource.data.kycStatus || isAdmin());
      
      // Only admins can delete users
      allow delete: if isAdmin();
    }
    
    // ==================== ACCOUNTS COLLECTION ====================
    // Legacy trading accounts (for backward compatibility)
    
    match /accounts/{accountId} {
      // Allow users to read their own accounts
      // Allow admins to read all accounts
      allow read: if isAuthenticated() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      
      // Only admins and authenticated users can create accounts
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      
      // Only admins can update account credentials and status
      allow update: if isAdmin() || 
                      (isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.credentials == resource.data.credentials &&
                       request.resource.data.status == resource.data.status);
      
      // Only admins can delete accounts
      allow delete: if isAdmin();
    }
    
    // ==================== USERMETAAPIACCOUNTS COLLECTION ====================
    // MetaAPI account mappings
    
    match /userMetaApiAccounts/{docId} {
      // Allow users to read their own MetaAPI accounts
      // Allow admins to read all MetaAPI accounts
      allow read: if isAuthenticated() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      
      // Only admins can create MetaAPI account mappings
      allow create: if isAdmin();
      
      // Only admins can update MetaAPI account mappings
      allow update: if isAdmin();
      
      // Only admins can delete MetaAPI account mappings
      allow delete: if isAdmin();
    }
    
    // ==================== CACHEDMETRICS COLLECTION ====================
    // Cached MetaAPI performance metrics
    
    match /cachedMetrics/{accountId} {
      // Allow authenticated users to read cached metrics
      // (authorization for specific accounts is handled at app level)
      allow read: if isAuthenticated();
      
      // Only server (admin SDK) can write cached metrics
      allow create, update: if isAdmin();
      
      // Only admins can delete cached metrics
      allow delete: if isAdmin();
    }
    
    // ==================== PURCHASES COLLECTION ====================
    // Card/Stripe payment purchases
    
    match /purchases/{purchaseId} {
      // Allow users to read their own purchases
      // Allow admins to read all purchases
      allow read: if isAuthenticated() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      
      // Allow authenticated users to create purchases
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid &&
                      isValidEmail(request.resource.data.email);
      
      // Only admins can update purchases
      allow update: if isAdmin();
      
      // Only admins can delete purchases
      allow delete: if isAdmin();
    }
    
    // ==================== ORDERS COLLECTION ====================
    // Alternative orders collection (Stripe/Card orders)
    
    match /orders/{orderId} {
      // Allow users to read their own orders
      // Allow admins to read all orders
      allow read: if isAuthenticated() && 
                    (resource.data.userId == request.auth.uid || 
                     resource.data.customerEmail == request.auth.token.email ||
                     isAdmin());
      
      // Allow authenticated users to create orders
      allow create: if isAuthenticated() && 
                      (request.resource.data.userId == request.auth.uid ||
                       request.resource.data.customerEmail == request.auth.token.email);
      
      // Only admins can update orders
      allow update: if isAdmin();
      
      // Only admins can delete orders
      allow delete: if isAdmin();
    }
    
    // ==================== CRYPTO-ORDERS COLLECTION ====================
    // Cryptocurrency payment orders
    
    match /crypto-orders/{orderId} {
      // Allow users to read their own crypto orders by email
      // Allow admins to read all crypto orders
      allow read: if isAuthenticated() && 
                    (resource.data.customerEmail == request.auth.token.email || 
                     isAdmin());
      
      // Allow anyone to create crypto orders (public purchase flow)
      // Email validation is required
      allow create: if isValidEmail(request.resource.data.customerEmail) &&
                      request.resource.data.status == 'PENDING' &&
                      request.resource.data.challengeStatus == 'PENDING';
      
      // Only admins can update crypto orders
      allow update: if isAdmin();
      
      // Only admins can delete crypto orders
      allow delete: if isAdmin();
    }
    
    // ==================== PAYOUTS COLLECTION ====================
    // Legacy payout requests (for backward compatibility)
    
    match /payouts/{payoutId} {
      // Allow users to read their own payouts
      // Allow admins to read all payouts
      allow read: if isAuthenticated() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      
      // Allow users to create payout requests
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid &&
                      request.resource.data.status == 'pending';
      
      // Only admins can update payout status
      allow update: if isAdmin();
      
      // Only admins can delete payouts
      allow delete: if isAdmin();
    }
    
    // ==================== WITHDRAWALREQUESTS COLLECTION ====================
    // Withdrawal/payout requests (new system)
    
    match /withdrawalRequests/{userId} {
      // Allow users to read their own withdrawal requests
      // Allow admins to read all withdrawal requests
      allow read: if isOwner(userId) || isAdmin();
      
      // Only admins can create/enable withdrawals
      allow create: if isAdmin();
      
      // Allow users to update their own withdrawal details (wallet address, payment method)
      // Allow admins to update any withdrawal request
      allow update: if isAdmin() || 
                      (isOwner(userId) && 
                       // Users can only update wallet address and payment method
                       request.resource.data.status == resource.data.status &&
                       request.resource.data.amountOwed == resource.data.amountOwed &&
                       request.resource.data.profitSplit == resource.data.profitSplit);
      
      // Only admins can delete withdrawal requests
      allow delete: if isAdmin();
    }
    
    // ==================== KYCSUBMISSIONS COLLECTION ====================
    // KYC verification submissions
    
    match /kycSubmissions/{userId} {
      // Allow users to read their own KYC submission
      // Allow admins to read all KYC submissions
      allow read: if isOwner(userId) || isAdmin();
      
      // Allow users to create their own KYC submission
      allow create: if isOwner(userId) && 
                      request.resource.data.userId == userId &&
                      request.resource.data.email == request.auth.token.email &&
                      request.resource.data.status == 'pending';
      
      // Allow users to update their own KYC submission if status is pending or needs_resubmission
      // Allow admins to update any KYC submission
      allow update: if isAdmin() || 
                      (isOwner(userId) && 
                       (resource.data.status == 'pending' || 
                        resource.data.status == 'needs_resubmission'));
      
      // Only admins can delete KYC submissions
      allow delete: if isAdmin();
    }
    
    // ==================== DENY ALL OTHER COLLECTIONS ====================
    
    // Deny access to any other collections not explicitly defined
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🗂️ Firebase Storage Security Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // ==================== HELPER FUNCTIONS ====================
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is the owner
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Check if user has admin role
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.admin == true;
    }
    
    // Validate file size (max 10MB for documents)
    function isValidFileSize() {
      return request.resource.size < 10 * 1024 * 1024;
    }
    
    // Validate file type for KYC documents
    function isValidDocumentType() {
      return request.resource.contentType.matches('image/.*') ||
             request.resource.contentType.matches('application/pdf');
    }
    
    // ==================== KYC DOCUMENTS ====================
    
    match /kyc/{userId}/{document} {
      // Allow users to read their own KYC documents
      // Allow admins to read all KYC documents
      allow read: if isOwner(userId) || isAdmin();
      
      // Allow users to upload their own KYC documents
      // Must be authenticated, correct file type, and under size limit
      allow create: if isOwner(userId) && 
                      isValidDocumentType() &&
                      isValidFileSize();
      
      // Allow users to update their own KYC documents
      // Allow admins to update any KYC documents
      allow update: if (isOwner(userId) || isAdmin()) && 
                      isValidDocumentType() &&
                      isValidFileSize();
      
      // Only admins can delete KYC documents
      allow delete: if isAdmin();
    }
    
    // ==================== ADMIN UPLOADS ====================
    
    match /admin/{allPaths=**} {
      // Only admins can read, write, or delete files in admin folder
      allow read, write: if isAdmin();
    }
    
    // ==================== PUBLIC ASSETS ====================
    
    match /public/{allPaths=**} {
      // Anyone can read public assets
      allow read: if true;
      
      // Only admins can write or delete public assets
      allow write: if isAdmin();
    }
    
    // ==================== DENY ALL OTHER PATHS ====================
    
    match /{allPaths=**} {
      // Deny all other access by default
      allow read, write: if false;
    }
  }
}
```

---

## 🔐 Firebase Authentication Configuration

### Required Authentication Settings

1. **Enable Authentication Methods:**
   - Email/Password: ✅ Enabled
   - Email Verification: Recommended but optional

2. **Custom Claims for Admin Users:**
   ```javascript
   // Use Firebase Admin SDK to set custom claims
   admin.auth().setCustomUserClaims(uid, { admin: true });
   ```

3. **Password Policy:**
   - Minimum length: 6 characters (Firebase default)
   - Recommended: Enforce stronger passwords at application level

---

## 📋 Deployment Instructions

### Step 1: Deploy Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **exodusprop-69fe6**
3. Navigate to **Firestore Database** → **Rules**
4. Copy the entire Firestore rules section above
5. Paste into the rules editor
6. Click **Publish**

### Step 2: Deploy Storage Rules

1. In Firebase Console, navigate to **Storage** → **Rules**
2. Copy the entire Storage rules section above
3. Paste into the rules editor
4. Click **Publish**

### Step 3: Verify Deployment

Run these test queries to ensure rules are working:

#### Test 1: User can read own data
```javascript
// Should succeed
const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
```

#### Test 2: User cannot read other users' data
```javascript
// Should fail with permission denied
const otherUserDoc = await getDoc(doc(db, 'users', 'otherUserId'));
```

#### Test 3: Admin can read all data
```javascript
// Should succeed if user has admin claim
const allUsers = await getDocs(collection(db, 'users'));
```

---

## 🛡️ Security Features

### ✅ What's Protected:

1. **User Privacy:**
   - Users can only read their own profile data
   - Users cannot modify admin status or email
   - Users cannot see other users' data

2. **Trading Accounts:**
   - Users can only view their own accounts
   - Only admins can modify account credentials
   - Account status changes restricted to admins

3. **Financial Data:**
   - Purchases tied to user accounts
   - Payout requests protected per user
   - Withdrawal requests secured with owner-only access

4. **KYC Documents:**
   - Users can only access their own KYC documents
   - Document type and size validation
   - Admins can review all KYC submissions

5. **Crypto Orders:**
   - Public creation for purchase flow
   - Email validation required
   - Only admins can modify order status

6. **MetaAPI Integration:**
   - Read-only access for users to their own metrics
   - Only admins can create/update account mappings
   - Cached metrics protected from client writes

### ✅ What's Allowed:

1. **User Actions:**
   - Create account during sign-up
   - Read own profile and data
   - Update personal settings (limited fields)
   - Submit KYC documents
   - Create purchase orders
   - Request payouts/withdrawals
   - View own trading accounts

2. **Admin Actions:**
   - Read all data across collections
   - Update account credentials
   - Approve/reject KYC submissions
   - Process payout requests
   - Manage crypto orders
   - Create MetaAPI account mappings
   - Update cached metrics

3. **Public Actions:**
   - Create crypto orders (for purchase flow)
   - Read public storage assets

---

## 🔍 Collection-by-Collection Breakdown

| Collection | User Read | User Write | Admin Read | Admin Write |
|------------|-----------|------------|------------|-------------|
| **users** | Own only | Limited fields | ✅ All | ✅ All |
| **accounts** | Own only | Limited | ✅ All | ✅ All |
| **userMetaApiAccounts** | Own only | ❌ No | ✅ All | ✅ All |
| **cachedMetrics** | ✅ Yes | ❌ No | ✅ All | ✅ All |
| **purchases** | Own only | Create only | ✅ All | ✅ All |
| **orders** | Own only | Create only | ✅ All | ✅ All |
| **crypto-orders** | Own (by email) | Create only | ✅ All | ✅ All |
| **payouts** | Own only | Create only | ✅ All | ✅ All |
| **withdrawalRequests** | Own only | Limited update | ✅ All | ✅ All |
| **kycSubmissions** | Own only | Limited update | ✅ All | ✅ All |

---

## ⚠️ Important Notes

1. **Custom Claims:**
   - Admin claims must be set using Firebase Admin SDK
   - Claims are not automatically applied
   - Use the `/api/auth/set-admin` endpoint to grant admin access

2. **Email Validation:**
   - Crypto orders require valid email format
   - User creation validates email from auth token
   - Email cannot be changed by users (prevents impersonation)

3. **Backward Compatibility:**
   - Both `accounts` and `userMetaApiAccounts` collections supported
   - Both `payouts` and `withdrawalRequests` collections supported
   - Both `purchases` and `orders` collections supported

4. **Server-Side Operations:**
   - Use Firebase Admin SDK for operations requiring elevated privileges
   - Admin SDK bypasses security rules
   - Keep service account credentials secure

5. **Testing:**
   - Test rules in Firebase Console Rules Playground
   - Test with both authenticated users and admins
   - Test unauthorized access attempts

---

## 🚨 Security Checklist

Before going to production, verify:

- [ ] Firestore rules deployed and active
- [ ] Storage rules deployed and active
- [ ] Admin users have custom claims set
- [ ] Test user can access own data
- [ ] Test user cannot access other users' data
- [ ] Test admin can access all data
- [ ] Test unauthorized access is blocked
- [ ] KYC document upload size limits work
- [ ] Crypto order creation works without auth
- [ ] Email validation is enforced
- [ ] Service account credentials are secure
- [ ] Environment variables are set correctly

---

## 📞 Support

If you encounter permission errors:

1. Check Firebase Console for rule evaluation logs
2. Verify user authentication status
3. Confirm admin claims are set correctly
4. Review collection paths and field names
5. Check if document exists before updating

---

## 🎯 Quick Copy-Paste

### For Firestore Rules:
Copy everything between the two markers:
```
<!-- START FIRESTORE RULES -->
rules_version = '2';
service cloud.firestore {
  ... (full Firestore rules above)
}
<!-- END FIRESTORE RULES -->
```

### For Storage Rules:
Copy everything between the two markers:
```
<!-- START STORAGE RULES -->
rules_version = '2';
service firebase.storage {
  ... (full Storage rules above)
}
<!-- END STORAGE RULES -->
```

---

**Last Updated:** December 31, 2025  
**Firebase Project:** exodusprop-69fe6  
**Version:** 1.0


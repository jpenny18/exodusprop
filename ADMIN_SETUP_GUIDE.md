# 🔐 Admin User Setup Guide

## Quick Start: Enable Admin Access

### **Step 1: Create or Use Existing Account**

**Option A: Create New Admin Account**
```bash
1. Visit http://localhost:3000/auth
2. Create account with:
   - Email: admin@exodusprop.com (or your choice)
   - Password: (your secure password)
   - Display Name: Admin
   - Country: United States
3. Complete registration
```

**Option B: Use Existing Account**
```bash
1. Login to your existing account
2. Note your email address
3. We'll upgrade this to admin in next step
```

---

### **Step 2: Set isAdmin Flag in Firebase**

**Method 1: Firebase Console (Recommended)**

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/project/exodusprop-69fe6
   - Login with Google account

2. **Navigate to Firestore:**
   - Click "Firestore Database" in left sidebar
   - Click on "users" collection

3. **Find Your User:**
   - Look for your email in the list
   - Click on the document (it's named with your UID)

4. **Add Admin Field:**
   - Click "Add field" button (or edit if exists)
   - Field name: `isAdmin`
   - Field type: `boolean`
   - Value: ✅ `true`
   - Click "Update"

5. **Verify:**
   - Your user document should now show: `isAdmin: true`

**Method 2: Firebase Admin SDK (Advanced)**

If you have Node.js access:
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Set user as admin
await db.collection('users').doc('USER_UID_HERE').update({
  isAdmin: true
});
```

---

### **Step 3: Access Admin Dashboard**

```bash
1. Go to http://localhost:3000/auth
2. Login with your admin account
3. Should auto-redirect to /admin (not /dashboard)
4. If still goes to /dashboard, refresh after Step 2 is complete
```

---

## 🎯 Admin Dashboard Overview

### **Navigation:**
Once logged in as admin, you have access to:

- **📊 Admin Dashboard** (`/admin`) - Overview stats
- **👥 Users** (`/admin/users`) - Manage users
- **💳 Accounts** (`/admin/accounts`) - **Add MT5 credentials here**
- **✅ KYC Reviews** (`/admin/kyc`) - Approve KYC submissions
- **💰 Payouts** (`/admin/payouts`) - Process payouts
- **🛒 Purchases** (`/admin/purchases`) - View all purchases
- **⚙️ Settings** (`/admin/settings`) - Admin settings

---

## 🧪 Testing Admin Features

### **Test 1: View Admin Dashboard**

```bash
1. Login as admin
2. Visit /admin
3. Should see stats cards:
   - Total Users: (real count from Firebase)
   - Total Revenue: (sum of all purchases)
   - Active Accounts: (accounts with credentials)
   - Pending KYC: (submitted KYC)
   - Pending Payouts: (requested payouts)
```

### **Test 2: Add MT5 Credentials**

**Setup:**
```bash
1. Complete a test purchase as a regular user
2. Login as admin
3. Go to /admin/accounts
```

**Add Credentials:**
```bash
1. See table with all accounts
2. Find account with "PENDING" status
3. Click "Add Credentials"
4. Enter test data:
   - Login: 12345678
   - Password: TestPass123!
   - Server: Exodus-Live01
5. Click "Save Credentials"
6. Account status changes to "ACTIVE"
```

**Verify User Side:**
```bash
1. Logout from admin
2. Login as the regular user
3. Go to "My Accounts"
4. See active account with credentials
```

---

## 🔒 Security Best Practices

### **Admin Account Security:**

1. **Strong Password:**
   ```
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Example: ExodusAdmin2025!Secure#
   ```

2. **Admin Email:**
   ```
   - Use company domain: admin@exodusprop.com
   - Don't use personal email
   - Consider: admin+exodus@yourdomain.com
   ```

3. **Limited Access:**
   ```
   - Only create 2-3 admin accounts
   - Document who has admin access
   - Review admin list quarterly
   ```

### **Firebase Security Rules:**

**Add these rules to Firestore:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      // Only admins can read all users
      allow read: if isAdmin();
      // Users can update their own data (except isAdmin field)
      allow update: if request.auth != null && 
                      request.auth.uid == userId &&
                      !request.resource.data.diff(resource.data).affectedKeys().hasAny(['isAdmin']);
      // Only admins can create users or change isAdmin
      allow create, update: if isAdmin();
    }
    
    // Purchases collection
    match /purchases/{purchaseId} {
      // Users can read their own purchases
      allow read: if request.auth != null && 
                    resource.data.userId == request.auth.uid;
      // Admins can read all purchases
      allow read: if isAdmin();
      // System can create purchases (authenticated users)
      allow create: if request.auth != null;
      // Only admins can update/delete
      allow update, delete: if isAdmin();
    }
    
    // Accounts collection
    match /accounts/{accountId} {
      // Users can read their own accounts
      allow read: if request.auth != null && 
                    resource.data.userId == request.auth.uid;
      // Admins can read all accounts
      allow read: if isAdmin();
      // Only admins can create/update accounts
      allow create, update: if isAdmin();
    }
    
    // KYC collection (if you create one)
    match /kyc/{kycId} {
      allow read: if request.auth != null && 
                    resource.data.userId == request.auth.uid;
      allow read, write: if isAdmin();
      allow create: if request.auth != null;
    }
    
    // Payouts collection
    match /payouts/{payoutId} {
      allow read: if request.auth != null && 
                    resource.data.userId == request.auth.uid;
      allow read, write: if isAdmin();
      allow create: if request.auth != null;
    }
  }
}
```

**To Apply Rules:**
```bash
1. Go to Firebase Console
2. Firestore Database → Rules tab
3. Paste rules above
4. Click "Publish"
```

---

## 👥 Multiple Admin Setup

### **Create Additional Admins:**

```bash
For each admin:
1. Have them create account via /auth
2. Note their UID (visible in Firebase Console)
3. Set isAdmin: true in their user document
4. Notify them they have admin access
```

### **Admin Role Definitions:**

**Super Admin:**
- Full access to all features
- Can add/remove other admins
- Manages payouts and finances

**Account Manager:**
- Can add MT5 credentials
- Can view accounts and purchases
- No payout access

**Support Admin:**
- Can view user accounts
- Can approve KYC
- Limited financial access

*(Implement role-based access in future version)*

---

## 🐛 Troubleshooting

### **"I'm admin but still redirected to /dashboard"**

**Fixes:**
1. Logout completely
2. Clear browser cache/cookies
3. Verify `isAdmin: true` in Firebase
4. Login again
5. Check browser console for errors

### **"Can't see pending accounts in /admin/accounts"**

**Check:**
1. Have users completed purchases?
2. Are purchases saved in Firebase?
3. Check browser console for Firebase errors
4. Verify Firestore security rules allow admin reads

### **"Credentials form doesn't save"**

**Check:**
1. All fields filled in?
2. Firebase connection working?
3. Security rules allow admin writes?
4. Check browser console for errors

### **"Stats showing 0 for everything"**

**Check:**
1. Is there real data in Firebase?
2. Browser console for errors?
3. Firebase security rules allow reads?
4. Try refreshing page

---

## 📊 Admin Dashboard Statistics

### **What's Real vs Mock:**

✅ **Real Data (from Firebase):**
- Total Users count
- Total Revenue sum
- Active Accounts count
- Pending KYC count
- Pending Payouts count
- Recent purchases list
- All accounts table

❌ **Not Yet Implemented:**
- User management page
- KYC review interface
- Payout processing interface
- Purchase details page
- Settings page

---

## 🚀 Next Steps

### **Immediate:**
1. ✅ Set yourself as admin
2. ✅ Access admin dashboard
3. ✅ Test adding MT5 credentials
4. ✅ Verify user receives account

### **Short Term:**
- [ ] Set up Firestore security rules
- [ ] Create 1-2 backup admin accounts
- [ ] Document credential sources
- [ ] Test full purchase → credential flow

### **Long Term:**
- [ ] Implement email notifications
- [ ] Build out remaining admin pages
- [ ] Add role-based access control
- [ ] Set up admin activity logging

---

## 📞 Support

If you need help:
1. Check browser console for errors
2. Check Firebase Console for data
3. Verify security rules are set
4. Review `MANUAL_MT5_SETUP.md` for workflow

---

**Quick Reference:**
- Admin Login: http://localhost:3000/auth
- Admin Dashboard: http://localhost:3000/admin
- Manage Accounts: http://localhost:3000/admin/accounts
- Firebase Console: https://console.firebase.google.com/project/exodusprop-69fe6

**Last Updated:** 2025-02-02


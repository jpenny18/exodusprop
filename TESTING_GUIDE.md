# 🧪 Testing Guide - Exodus Checkout Flow

## 🎯 Two Ways to Test

### **Option 1: Test Mode Bypass (Recommended for Development)**
**What it does:** Skips Whop payment entirely and simulates a successful purchase

**How to use:**
1. Go to http://localhost:3000/purchase
2. Fill out all billing information
3. Click "PROCEED TO PAYMENT"
4. ✅ **Check the yellow "🧪 Test Mode" checkbox**
5. Click "🚀 Simulate Payment & Create Account"
6. **Result:** 
   - Creates Firebase account
   - Generates trading account
   - Saves purchase to database
   - Redirects to dashboard

**Benefits:**
- ✅ No payment processor needed
- ✅ Instant testing
- ✅ Tests full Firebase integration
- ✅ Perfect for development

**⚠️ Important:** Remove this before going to production!

---

### **Option 2: Test Whop Payments (For Real Payment Testing)**

#### **Step 1: Check if Plans are in Test Mode**
1. Go to your [Whop Dashboard](https://whop.com/hub)
2. Navigate to "Products" or "Plans"
3. Check each plan:
   - `plan_FyRDLrDEd8ilp` (25K)
   - `plan_XB7LYZSLzaljt` (50K)
   - `plan_JJ9nO8LMXVsCD` (100K)
   - `plan_mDL1lFqScmlUK` (200K)
4. Make sure they're in **"Test Mode"** (not Live Mode)

#### **Step 2: Use Whop Test Cards**
Once plans are in Test Mode, use these test cards:

**Successful Payment:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**Declined Card:**
```
Card Number: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

**Requires Authentication (3D Secure):**
```
Card Number: 4000 0025 0000 3155
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

#### **Step 3: If Plans Are in Live Mode**

**Option A: Switch to Test Mode (Recommended)**
1. Go to Whop Dashboard
2. Duplicate each plan as a "Test Plan"
3. Update your plan IDs in the code:
   ```typescript
   // In app/purchase/page.tsx
   const accounts = [
     { size: "$25,000", price: 247, label: "25K", planId: "plan_TEST_25K" },
     { size: "$50,000", price: 399, label: "50K", planId: "plan_TEST_50K" },
     // ... etc
   ];
   ```

**Option B: Use Test Mode Bypass (Simpler)**
- Just use Option 1 above - the yellow checkbox
- Skip Whop entirely for development

---

## 🔄 Complete Test Flow

### **Using Test Mode (No Payment):**
1. Visit http://localhost:3000/purchase
2. Fill in all fields:
   ```
   First Name: John
   Last Name: Doe
   Email: test@example.com
   Street: 123 Test St
   City: Test City
   State: CA
   Country: United States
   Postal: 12345
   ```
3. Select account size (25K, 50K, 100K, or 200K)
4. Click "PROCEED TO PAYMENT"
5. ✅ **Enable Test Mode** (yellow checkbox)
6. Click "Simulate Payment"
7. **Watch:**
   - Console logs show Firebase operations
   - Redirects to dashboard
   - Dashboard shows your new account

### **Verify in Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com/project/exodusprop-69fe6)
2. Check **Authentication** → Should see new user
3. Check **Firestore Database**:
   - `users` collection → Your user document
   - `purchases` collection → Purchase record
   - `accounts` collection → Trading account with MT5 credentials

---

## 🐛 Troubleshooting

### **"Test cards not working with Whop"**
- ✅ **Solution:** Use Test Mode bypass (Option 1)
- Or verify plans are in Test Mode in Whop Dashboard

### **"Payment completes but no account created"**
- Check browser console for errors
- Check Firebase Console → Firestore Database
- Make sure Firestore security rules allow writes
- Check `.env.local` has correct Firebase credentials

### **"Redirects but dashboard is empty"**
- User account was created but might not have loaded data yet
- Check Firebase Console to verify data exists
- Try refreshing the dashboard
- Check browser console for errors

### **"Firebase permission denied"**
- Need to set up Firestore security rules
- See `FIREBASE_SETUP.md` for rule examples
- Quick fix for testing:
  ```javascript
  // Temporary - allows all authenticated users
  allow read, write: if request.auth != null;
  ```

---

## 📊 What Gets Created When You Test

### **1. Firebase Authentication**
- New user account with email/password
- UID generated automatically

### **2. Firestore Database**

**users collection:**
```javascript
{
  uid: "abc123...",
  email: "test@example.com",
  displayName: "John Doe",
  country: "United States",
  createdAt: timestamp,
  accounts: [],           // Empty initially
  kycStatus: "pending",
  isAdmin: false
}
```

**purchases collection:**
```javascript
{
  userId: "abc123...",
  email: "test@example.com",
  accountSize: "$100,000",
  accountPrice: 699,
  planId: "plan_JJ9nO8LMXVsCD",
  receiptId: "test_receipt_1234567890",
  billingInfo: { ... },
  timestamp: timestamp,
  status: "completed"
}
```

**⚠️ Important:** Trading accounts are NO LONGER created automatically! You must add MT5 credentials manually via the Admin Dashboard.

---

## 🔧 Manual MT5 Credentials Setup (Admin)

### **After Purchase is Complete:**

1. **Go to Admin Dashboard:**
   - Login as admin user (set `isAdmin: true` in Firebase user document)
   - Navigate to `/admin/accounts`

2. **View Pending Accounts:**
   - See all accounts awaiting credentials
   - Click "Add Credentials" on any pending account

3. **Add MT5 Credentials:**
   - Enter MT5 Login ID (from your broker)
   - Enter MT5 Password (from your broker)
   - Enter MT5 Server (e.g., "Exodus-Live01")
   - Click "Save Credentials"

4. **Account Becomes Active:**
   - Status changes from "pending" to "active"
   - User can now see credentials in their dashboard
   - User receives login details via email (TODO: implement email)

---

## ✅ Success Checklist

After testing purchase flow:
- [ ] User appears in Firebase Authentication
- [ ] User document in Firestore `users` collection
- [ ] Purchase record in Firestore `purchases` collection
- [ ] Dashboard loads without errors
- [ ] "My Accounts" page shows "No Accounts Yet" message

After admin adds MT5 credentials:
- [ ] Trading account in Firestore `accounts` collection
- [ ] Account status is "active"
- [ ] Account has MT5 credentials (login, password, server)
- [ ] "My Accounts" page displays the account
- [ ] Can view account credentials in modal

---

## 🚀 Next Steps

### **For Development:**
- ✅ Keep using Test Mode bypass
- Perfect for testing Firebase integration
- No payment processor needed

### **Before Production:**
1. **Remove Test Mode:**
   - Delete the test mode checkbox code
   - Or hide it with environment variable check:
     ```typescript
     {process.env.NODE_ENV === 'development' && (
       // Test mode checkbox here
     )}
     ```

2. **Verify Whop Setup:**
   - Plans in Live Mode
   - Real payment processing enabled
   - Webhook configured (for production)

3. **Test Real Payment:**
   - Use actual card
   - Verify money processing
   - Test entire flow end-to-end

---

## 💡 Pro Tips

1. **Quick Test Reset:**
   ```
   - Delete user from Firebase Authentication
   - Delete documents from Firestore collections
   - Test again with fresh state
   ```

2. **Multiple Test Accounts:**
   ```
   - Use different emails each time
   - test1@example.com, test2@example.com, etc.
   ```

3. **Console Logging:**
   ```
   - Keep browser console open
   - Watch for Firebase operations
   - Check for any errors
   ```

4. **Firebase Emulator (Advanced):**
   ```
   - Run Firebase locally for testing
   - No impact on production database
   - See Firebase docs for setup
   ```

---

## 🎉 Happy Testing!

**Recommended approach:**
1. Use Test Mode bypass (yellow checkbox)
2. Test complete flow multiple times
3. Verify Firebase data creation
4. Then test real Whop payments when ready

**Questions?**
- Check `FIREBASE_SETUP.md` for Firebase configuration
- Check `CONSOLE_ERRORS_EXPLAINED.md` for error help
- Check Whop documentation for payment issues


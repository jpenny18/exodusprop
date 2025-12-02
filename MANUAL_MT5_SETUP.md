# 🔧 Manual MT5 Setup - Documentation

## 📋 Overview

**Changed:** Removed automatic MT5 account creation during checkout  
**Reason:** No broker API integration available yet  
**Solution:** Manual credentials setup via Admin Dashboard

---

## 🔄 What Changed

### **Before (Automatic):**
1. User purchases account → Whop payment completes
2. System automatically creates trading account in Firebase
3. System generates fake MT5 credentials (random login/password)
4. User immediately sees "active" account with credentials

### **After (Manual):**
1. User purchases account → Whop payment completes
2. System only saves purchase to Firebase
3. **No trading account created yet**
4. User sees "No Accounts Yet" with pending message
5. **Admin manually adds MT5 credentials**
6. User receives account and can login

---

## 🚀 New Purchase Flow

### **User Journey:**

1. **Purchase:**
   - Visit `/purchase` page
   - Fill billing information
   - Select account size (25K/50K/100K/200K)
   - Complete payment (or use test mode)

2. **After Payment:**
   - Redirected to `/dashboard`
   - See "Welcome" message
   - Navigate to "My Accounts"
   - See: **"No Accounts Yet - Your trading account credentials are being set up. You'll receive an email within 24 hours."**

3. **After Admin Setup:**
   - Receive email with MT5 credentials (TODO: implement email)
   - Return to dashboard
   - See account with "Active" status
   - Click account to view credentials

---

## 🛠️ Admin Setup Process

### **Step 1: Access Admin Dashboard**

**Requirements:**
- Admin user account in Firebase
- Set `isAdmin: true` in user document

**Login:**
```
1. Visit /auth
2. Login with admin credentials
3. Automatically redirected to /admin
```

### **Step 2: Navigate to Accounts Management**

```
1. From admin dashboard, click "Accounts" in sidebar
2. Or visit /admin/accounts directly
```

### **Step 3: View Pending Accounts**

You'll see a table with:
- **Total Accounts:** All accounts ever created
- **Active:** Accounts with credentials (ready to trade)
- **Pending Setup:** Accounts waiting for MT5 credentials ⚠️
- **Breached:** Accounts that failed evaluation

### **Step 4: Add MT5 Credentials**

**For Each Pending Account:**

1. **Click "Add Credentials" button**
   - Modal opens with account details

2. **Get MT5 Credentials from Your Broker:**
   - Login to your MT5 broker admin panel
   - Create new trading account for the user
   - Copy: Login ID, Password, Server name

3. **Enter Credentials in Modal:**
   ```
   MT5 Login ID: 12345678
   MT5 Password: TempPass123!
   MT5 Server: Exodus-Live01
   ```

4. **Click "Save Credentials"**
   - Account status changes from "pending" → "active"
   - User can now see account in their dashboard
   - Credentials stored securely in Firebase

---

## 📊 Firebase Structure

### **users Collection:**
```javascript
{
  uid: "abc123...",
  email: "user@example.com",
  displayName: "John Doe",
  country: "United States",
  createdAt: timestamp,
  accounts: ["accountId123"],  // Added when admin creates account
  kycStatus: "pending",
  isAdmin: false  // Set to true for admin users
}
```

### **purchases Collection:**
```javascript
{
  id: "purchaseId123",
  userId: "abc123...",
  email: "user@example.com",
  accountSize: "$100,000",
  accountPrice: 699,
  planId: "plan_JJ9nO8LMXVsCD",
  receiptId: "whop_receipt_xyz",
  billingInfo: {
    firstName: "John",
    lastName: "Doe",
    streetAddress: "123 Main St",
    city: "New York",
    state: "NY",
    country: "United States",
    postalCode: "10001"
  },
  timestamp: "2025-02-02T12:00:00.000Z",
  status: "completed"
}
```

### **accounts Collection (Created by Admin):**
```javascript
{
  id: "accountId123",
  userId: "abc123...",
  accountSize: "$100,000",
  accountType: "1-Step",
  status: "pending",  // Changes to "active" when credentials added
  balance: 100000,
  profit: 0,
  startDate: timestamp,
  credentials: null,  // Initially null
  // After admin adds credentials:
  credentials: {
    login: "12345678",
    password: "TempPass123!",
    server: "Exodus-Live01"
  },
  credentialsAddedAt: timestamp,
  planId: "plan_JJ9nO8LMXVsCD",
  receiptId: "whop_receipt_xyz"
}
```

---

## 🔐 Security Considerations

### **Admin Access:**
- Only users with `isAdmin: true` can access `/admin`
- Non-admin users are redirected to `/dashboard`
- Use Firebase security rules to enforce this server-side

### **Credentials Storage:**
- MT5 passwords stored in Firebase (currently plaintext)
- **TODO:** Encrypt passwords before storing
- Only admin and account owner can view credentials

### **Firestore Security Rules Example:**
```javascript
// /accounts collection
match /accounts/{accountId} {
  // Users can read their own accounts
  allow read: if request.auth != null 
              && resource.data.userId == request.auth.uid;
  
  // Only admins can create/update
  allow create, update: if request.auth != null 
                        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
}
```

---

## 📧 Email Notification (TODO)

**When Admin Adds Credentials:**

Send email to user with:
```
Subject: Your Exodus Trading Account is Ready!

Hi John,

Your trading account has been set up and is ready to use!

Account Details:
- Size: $100,000
- Type: 1-Step Evaluation
- Status: Active

MT5 Login Credentials:
- Login: 12345678
- Password: TempPass123!
- Server: Exodus-Live01

Visit your dashboard to start trading:
https://exodusprop.com/dashboard

Good luck!
- Exodus Trading Team
```

**Implementation Options:**
1. **Resend:** Email API (as planned)
2. **SendGrid:** Email service
3. **Firebase Cloud Functions:** Triggered on account status change

---

## 🧪 Testing the New Flow

### **1. Test Purchase (User Side):**
```bash
1. Visit http://localhost:3000/purchase
2. Fill out form
3. Enable "Test Mode" checkbox
4. Click "Simulate Payment"
5. Redirected to /dashboard
6. Check "My Accounts" → See "No Accounts Yet"
```

### **2. Set Admin User:**
```bash
1. Go to Firebase Console
2. Firestore Database → users collection
3. Find your admin user
4. Edit document → Set isAdmin: true
5. Save
```

### **3. Add Credentials (Admin Side):**
```bash
1. Visit http://localhost:3000/admin
2. Click "Accounts" in sidebar
3. See pending account in table
4. Click "Add Credentials"
5. Enter test credentials:
   - Login: 12345678
   - Password: TestPass123!
   - Server: Exodus-Live01
6. Save
```

### **4. Verify User Can See Account:**
```bash
1. Logout from admin
2. Login as regular user
3. Go to "My Accounts"
4. See active account
5. Click account → View credentials modal
```

---

## 🎯 Admin Dashboard Features

### **Current Pages:**
- ✅ **Dashboard:** Overview stats (users, revenue, accounts, KYC, payouts)
- ✅ **Accounts:** Manage all trading accounts, add MT5 credentials
- 🚧 **Users:** View all registered users (TODO: full implementation)
- 🚧 **KYC Reviews:** Approve/reject KYC submissions (TODO: full implementation)
- 🚧 **Payouts:** Process payout requests (TODO: full implementation)
- 🚧 **Purchases:** View all purchases (TODO: full implementation)
- 🚧 **Settings:** Admin settings (TODO: full implementation)

### **Stats Pulled from Firebase:**
```javascript
// All data is now REAL from Firebase
totalUsers: count of users collection
totalRevenue: sum of all completed purchases
activeAccounts: accounts with status "active"
pendingKYC: users with kycStatus "submitted"
pendingPayouts: payouts with status "pending"
```

---

## ✅ Migration Checklist

### **Code Changes:**
- [x] Remove automatic MT5 credential generation
- [x] Update `savePurchase()` to not create accounts
- [x] Update `createTradingAccount()` for manual use only
- [x] Add admin functions: `getAllAccounts()`, `updateAccountCredentials()`
- [x] Create `/admin/accounts` page with credentials form
- [x] Update user dashboard to show "pending" message
- [x] Connect admin dashboard to real Firebase data

### **Firebase Setup:**
- [ ] Set admin user: `isAdmin: true`
- [ ] Configure Firestore security rules
- [ ] Test purchase → pending account flow
- [ ] Test admin credential addition
- [ ] Test user receives active account

### **Production Checklist:**
- [ ] Remove test mode from `/purchase` page
- [ ] Implement email notifications (Resend)
- [ ] Encrypt MT5 passwords before storage
- [ ] Set up proper Firebase security rules
- [ ] Create admin user accounts
- [ ] Document MT5 credential source/process
- [ ] Train admins on credential setup

---

## 🔗 Related Files

**Modified:**
- `/lib/auth-helpers.ts` - Removed auto MT5 generation
- `/app/purchase/page.tsx` - No longer creates accounts
- `/app/admin/page.tsx` - Real Firebase stats
- `/app/dashboard/accounts/page.tsx` - Pending message

**Created:**
- `/app/admin/accounts/page.tsx` - New admin accounts manager

**Documentation:**
- `TESTING_GUIDE.md` - Updated testing instructions
- `MANUAL_MT5_SETUP.md` - This file

---

## 📞 Support

**For Admins:**
- Bookmark: `/admin/accounts` for quick access
- Check daily for pending accounts
- Aim for < 24 hour turnaround on credentials

**For Users:**
- If no account after 48 hours, contact support
- Check spam folder for credential emails
- Support email: support@exodusprop.com (TODO: configure)

---

## 🚀 Future Enhancements

### **Broker API Integration:**
When broker API is available:
1. Replace manual credential form with API call
2. Automatically create MT5 accounts on purchase
3. Return to instant account creation
4. Keep admin interface for manual overrides

### **Automation Ideas:**
- Auto-send emails when credentials added
- Slack/Discord notification for new purchases
- Bulk credential upload (CSV import)
- MT5 account monitoring/sync
- Automatic account status updates from broker

---

**Last Updated:** 2025-02-02  
**Version:** 1.0  
**Status:** Production Ready (Manual Process)


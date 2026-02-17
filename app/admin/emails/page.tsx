'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "@/components/DashboardLayout";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "@/lib/auth-helpers";
import { collection, query, orderBy, limit as firestoreLimit, onSnapshot } from 'firebase/firestore';
import { Mail, Send, Loader2, Check, X, Search, Eye, Code } from 'lucide-react';

interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  challengeAmount: string;
  platform: string;
  challengeType: string;
  status: string;
  orderType: 'crypto' | 'card';
}

export default function AdminEmailsPage() {
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'crypto' | 'card'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrderSelect, setShowOrderSelect] = useState(false);
  const [selectedEmailType, setSelectedEmailType] = useState<string>('login-credentials');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [editableHtml, setEditableHtml] = useState('');
  const [formData, setFormData] = useState({
    toEmail: '',
    toName: '',
    login: '',
    password: '',
    server: '',
    platform: 'MT5',
    accountSize: '$25,000',
    challengeType: '1-Step Challenge',
    accountType: '1-step',
    breachType: 'maxDrawdown',
    maxDrawdown: 7.5,
    dailyDrawdown: 5.2,
    currentDrawdown: 5.0
  });

  const emailTypes = [
    { value: 'login-credentials', label: 'Login Credentials' },
    { value: 'challenge-pass', label: 'Challenge Pass' },
    { value: 'challenge-fail', label: 'Challenge Fail' },
    { value: 'drawdown-warning', label: 'Drawdown Warning' },
    { value: 'funded-pass', label: 'Funded Pass' },
    { value: 'funded-fail-1step', label: 'Funded Fail (1-Step)' },
    { value: 'funded-fail-elite', label: 'Funded Fail (Elite)' },
    { value: 'funded-warning-1step', label: 'Funded Warning (1-Step)' },
    { value: 'funded-warning-elite', label: 'Funded Warning (Elite)' },
    { value: 'crypto-order', label: 'Crypto Order (Customer)' },
    { value: 'admin-notification', label: 'Admin Notification' },
  ];

  const adminNavItems = [
    { name: "Admin Dashboard", href: "/admin", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>) },
    { name: "Crypto Orders", href: "/admin/crypto-orders", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" /></svg>) },
    { name: "Card Orders", href: "/admin/card-orders", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" /></svg>) },
    { name: "Accounts", href: "/admin/accounts", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>) },
    { name: "Emails", href: "/admin/emails", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>) },
    { name: "KYC Reviews", href: "/admin/kyc", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>) },
    { name: "Payouts", href: "/admin/payouts", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>) },
    { name: "Users", href: "/admin/users", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>) },
    { name: "Settings", href: "/admin/settings", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>) },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUser(user.uid);
        if (!userData?.isAdmin) {
          router.push("/dashboard");
          return;
        }
        setCurrentUserEmail(user.email || "");
      } else {
        router.push("/auth");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Load recent crypto orders
    const cryptoQuery = query(collection(db, 'crypto-orders'), orderBy('createdAt', 'desc'), firestoreLimit(20));
    const unsubscribeCrypto = onSnapshot(cryptoQuery, (snapshot) => {
      const cryptoOrders: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        cryptoOrders.push({
          id: doc.id,
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          challengeAmount: data.challengeAmount,
          platform: data.platform,
          challengeType: data.challengeType || '1-Step Challenge',
          status: data.status,
          orderType: 'crypto'
        });
      });
      
      // Load recent card orders (purchases)
      const cardQuery = query(collection(db, 'purchases'), orderBy('timestamp', 'desc'), firestoreLimit(20));
      onSnapshot(cardQuery, (cardSnapshot) => {
        const cardOrders: Order[] = [];
        cardSnapshot.forEach((doc) => {
          const data = doc.data();
          cardOrders.push({
            id: doc.id,
            customerEmail: data.email,
            customerName: `${data.billingInfo?.firstName || ''} ${data.billingInfo?.lastName || ''}`.trim(),
            challengeAmount: data.accountSize,
            platform: data.platform,
            challengeType: '1-Step Challenge',
            status: data.status,
            orderType: 'card'
          });
        });
        
        // Merge and sort by most recent first (crypto orders have createdAt, card orders have timestamp)
        setOrders([...cryptoOrders, ...cardOrders]);
      });
    });

    return () => unsubscribeCrypto();
  }, []);

  // Update editable HTML when email type changes or toggling code editor
  useEffect(() => {
    // Only update when switching email types or when leaving code editor mode
    const name = formData.toName || '[Customer Name]';
    const accountSize = parseInt(formData.accountSize.replace(/[$,]/g, '')) || 25000;
    const orderId = 'EXO-' + Date.now().toString().slice(-8);
    
    let html = '';
    switch (selectedEmailType) {
      case 'login-credentials':
        html = generateLoginCredentialsPreview();
        break;
      case 'challenge-pass':
        html = generateChallengePassPreview(name, formData.challengeType, accountSize);
        break;
      case 'challenge-fail':
        html = generateChallengeFailPreview(name, formData.challengeType, accountSize, formData.breachType, formData.maxDrawdown, formData.dailyDrawdown);
        break;
      case 'drawdown-warning':
        html = generateDrawdownWarningPreview(name, formData.challengeType, accountSize, formData.currentDrawdown);
        break;
      case 'funded-pass':
        html = generateFundedPassPreview(name, accountSize);
        break;
      case 'funded-fail-1step':
        html = generateFundedFailPreview(name, accountSize, formData.breachType, formData.maxDrawdown, formData.dailyDrawdown, '1-step');
        break;
      case 'funded-fail-elite':
        html = generateFundedFailPreview(name, accountSize, formData.breachType, formData.maxDrawdown, formData.dailyDrawdown, 'elite');
        break;
      case 'funded-warning-1step':
        html = generateFundedWarningPreview(name, accountSize, formData.currentDrawdown, '1-step');
        break;
      case 'funded-warning-elite':
        html = generateFundedWarningPreview(name, accountSize, formData.currentDrawdown, 'elite');
        break;
      case 'crypto-order':
        html = generateCryptoOrderPreview(name, formData.challengeType, accountSize, orderId);
        break;
      case 'admin-notification':
        html = generateAdminNotificationPreview(name, formData.toEmail || 'customer@example.com', formData.challengeType, accountSize, orderId);
        break;
      default:
        html = generateLoginCredentialsPreview();
    }
    
    setEditableHtml(html);
  }, [selectedEmailType]);

  const handleSelectOrder = (order: Order) => {
    setFormData({
      ...formData,
      toEmail: order.customerEmail,
      toName: order.customerName,
      accountSize: order.challengeAmount,
      platform: order.platform || 'MT5',
      challengeType: order.challengeType || '1-Step Challenge'
    });
    setShowOrderSelect(false);
    setSearchTerm('');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter;
    return matchesSearch && matchesType;
  });

  const generateLoginCredentialsPreview = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #60A5FA 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Exodus</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your Trading Challenge Credentials</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello <strong>${formData.toName || '[Customer Name]'}</strong>,
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Congratulations! Your ${formData.challengeType} account is ready. Below are your login credentials:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Platform:</strong></td>
                        <td style="color: #333333; font-size: 14px; text-align: right; padding: 8px 0;">${formData.platform}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Login:</strong></td>
                        <td style="color: #333333; font-size: 14px; text-align: right; padding: 8px 0; font-family: monospace;">${formData.login || '[Login ID]'}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Password:</strong></td>
                        <td style="color: #333333; font-size: 14px; text-align: right; padding: 8px 0; font-family: monospace;">${formData.password || '[Password]'}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Server:</strong></td>
                        <td style="color: #333333; font-size: 14px; text-align: right; padding: 8px 0;">${formData.server}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Account Size:</strong></td>
                        <td style="color: #60A5FA; font-size: 16px; font-weight: bold; text-align: right; padding: 8px 0;">${formData.accountSize}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                <strong>Next Steps:</strong>
              </p>
              <ol style="color: #333333; font-size: 14px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li>Download and install ${formData.platform} if you haven't already</li>
                <li>Use the credentials above to login to your trading account</li>
                <li>Review the challenge rules in your dashboard</li>
                <li>Start trading and reach your profit target!</li>
              </ol>
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
                If you have any questions, please don't hesitate to contact our support team at <a href="mailto:support@exodusprop.com" style="color: #60A5FA; text-decoration: none;">support@exodusprop.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0;">© 2024 Exodus. All rights reserved.</p>
              <p style="color: #999999; font-size: 11px; margin: 0;">This email contains sensitive information. Please keep it secure.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  };

  const generateChallengePassPreview = (name: string, challengeType: string, accountSize: number) => {
    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); padding: 50px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
            <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 18px;">You've Passed Your Challenge!</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 50px 40px;">
            <p style="color: #1a1a1a; font-size: 18px;">Hello <strong>${name}</strong>,</p>
            <p style="color: #4a5568; font-size: 16px;">Great news! You've successfully passed your <strong>${challengeType}</strong> challenge with a $${accountSize.toLocaleString()} account.</p>
            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
              <h2 style="color: #065f46; font-size: 18px; margin: 0 0 10px 0;">✅ What Happens Next?</h2>
              <p style="color: #047857; margin: 0;">Your funded account will be set up shortly. You'll receive another email with your funded account credentials and next steps.</p>
            </div>
            <p style="color: #64748b; font-size: 14px;">Questions? Contact: <a href="mailto:support@exodusprop.com" style="color: #1e40af;">support@exodusprop.com</a></p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">© 2024 Exodus. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
  };

  const generateChallengeFailPreview = (name: string, challengeType: string, accountSize: number, breachType: string, maxDrawdown: number, dailyDrawdown: number) => {
    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 50px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Challenge Update</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 50px 40px;">
            <p style="color: #1a1a1a; font-size: 18px;">Hello <strong>${name}</strong>,</p>
            <p style="color: #4a5568; font-size: 16px;">Your ${challengeType} challenge ($${accountSize.toLocaleString()}) has been closed due to rule violations.</p>
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
              <h2 style="color: #dc2626; font-size: 18px; margin: 0 0 10px 0;">Violation Details</h2>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Max Drawdown:</strong> ${maxDrawdown.toFixed(2)}% (Limit: 6%)</li>
                <li><strong>Daily Loss:</strong> ${dailyDrawdown.toFixed(2)}% (Limit: 4%)</li>
              </ul>
            </div>
            <p style="color: #4a5568;">You can purchase a new challenge anytime. <a href="https://exodusprop.com/purchase" style="color: #1e40af;">Start a New Challenge</a></p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">© 2024 Exodus. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
  };

  const generateDrawdownWarningPreview = (name: string, challengeType: string, accountSize: number, currentDrawdown: number) => {
    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); padding: 50px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">⚠️ Drawdown Warning</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 50px 40px;">
            <p style="color: #1a1a1a; font-size: 18px;">Hello <strong>${name}</strong>,</p>
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
              <p style="color: #92400e;"><strong>Warning:</strong> Your ${challengeType} account ($${accountSize.toLocaleString()}) drawdown is at ${currentDrawdown.toFixed(2)}%, approaching the 6% limit.</p>
            </div>
            <p style="color: #4a5568;">Please review your positions and maintain proper risk management.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">© 2024 Exodus. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
  };

  const generateFundedPassPreview = (name: string, accountSize: number) => {
    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); padding: 50px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">🎊 Your Funded Account Is Ready!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 50px 40px;">
            <p style="color: #1a1a1a; font-size: 18px;">Hello <strong>${name}</strong>,</p>
            <p style="color: #4a5568; font-size: 16px;">Congratulations! Your funded account ($${accountSize.toLocaleString()}) is now active. You can start trading with our capital and earn performance-based rewards.</p>
            <div style="background-color: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 20px; margin: 20px 0;">
              <h2 style="color: #6d28d9; font-size: 18px; margin: 0 0 10px 0;">Your Funded Account Benefits</h2>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Up to 90% profit split</li>
                <li>On-demand payout requests</li>
                <li>Same risk parameters apply</li>
              </ul>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">© 2024 Exodus. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
  };

  const generateFundedFailPreview = (name: string, accountSize: number, breachType: string, maxDrawdown: number, dailyDrawdown: number, accountType: string) => {
    const isElite = accountType === 'elite';
    const fundedMaxDD = isElite ? null : 6;
    const fundedDailyDD = isElite ? 10 : 4;
    
    let breachSpecifics = '';
    if (isElite) {
      breachSpecifics = `<li><strong style="color: #dc2626;">Your Daily Drawdown:</strong> ${dailyDrawdown.toFixed(2)}%</li>
                        <li><strong>Maximum Allowed:</strong> ${fundedDailyDD}% (Trailing EOD)</li>`;
    } else {
      if (breachType === 'maxDrawdown') {
        breachSpecifics = `<li><strong style="color: #dc2626;">Your Maximum Drawdown:</strong> ${maxDrawdown.toFixed(2)}%</li>
                          <li><strong>Maximum Allowed:</strong> ${fundedMaxDD}% (Static)</li>`;
      } else if (breachType === 'riskViolation') {
        breachSpecifics = `<li><strong style="color: #dc2626;">Your Daily Drawdown:</strong> ${dailyDrawdown.toFixed(2)}%</li>
                          <li><strong>Maximum Allowed:</strong> ${fundedDailyDD}%</li>`;
      } else {
        breachSpecifics = `<li><strong style="color: #dc2626;">Your Maximum Drawdown:</strong> ${maxDrawdown.toFixed(2)}%</li>
                          <li><strong style="color: #dc2626;">Your Daily Drawdown:</strong> ${dailyDrawdown.toFixed(2)}%</li>`;
      }
    }

    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 50px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Funded Account Update</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 50px 40px;">
            <p style="color: #1a1a1a; font-size: 18px;">Hello <strong>${name}</strong>,</p>
            <div style="background-color: #fef2f2; border: 2px solid #fecaca; padding: 20px; margin: 20px 0;">
              <p style="color: #991b1b; margin: 0;">Your ${isElite ? 'Elite' : '1-Step'} funded account ($${accountSize.toLocaleString()}) has been terminated due to rule violations.</p>
            </div>
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff5f5; border-left: 4px solid #dc2626; border-radius: 8px; margin-bottom: 30px;">
              <tr>
                <td style="padding: 25px;">
                  <h2 style="color: #dc2626; font-size: 18px; margin: 0 0 15px 0;">❌ Violation Details</h2>
                  <ul style="margin: 0; padding-left: 20px; color: #4a5568;">${breachSpecifics}</ul>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; margin-bottom: 30px;">
              <tr>
                <td style="padding: 25px;">
                  <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 15px 0;">${isElite ? 'Elite' : '1-Step'} Funded Account Rules Reminder</h2>
                  <ul style="margin: 0; padding-left: 20px; color: #4a5568;">
                    ${isElite 
                      ? `<li><strong>Maximum Drawdown:</strong> None</li>
                         <li><strong>Daily Loss Limit:</strong> 10% (Trailing EOD)</li>`
                      : `<li><strong>Maximum Drawdown:</strong> 6% (Static)</li>
                         <li><strong>Daily Loss Limit:</strong> 4% maximum per day</li>`
                    }
                    <li><strong>Important:</strong> All risk parameters must be maintained at all times</li>
                  </ul>
                </td>
              </tr>
            </table>
            <p style="color: #4a5568;">You can start a new challenge anytime. <a href="https://exodusprop.com/purchase" style="color: #1e40af;">Start a New Challenge</a></p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">© 2024 Exodus. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
  };

  const generateFundedWarningPreview = (name: string, accountSize: number, currentDrawdown: number, accountType: string) => {
    const isElite = accountType === 'elite';
    const fundedMaxDD = isElite ? null : 6;
    const fundedDailyDD = isElite ? 10 : 4;

    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); padding: 50px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">⚠️ Funded Account Warning</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 50px 40px;">
            <p style="color: #1a1a1a; font-size: 18px;">Hello <strong>${name}</strong>,</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin: 20px 0;">
              <tr>
                <td style="padding: 25px;">
                  <p style="color: #92400e;">⚠️ Your ${isElite ? 'Elite' : '1-Step'} funded account drawdown is at ${currentDrawdown.toFixed(2)}%.</p>
                  <p style="color: #92400e; font-size: 14px; margin: 10px 0 0 0;"><strong>${isElite ? 'Elite' : '1-Step'} Funded Account Limits:</strong></p>
                  <ul style="margin: 5px 0 0 0; padding-left: 20px; color: #78350f; font-size: 14px;">
                    ${isElite 
                      ? `<li><strong>Maximum Drawdown:</strong> None</li>
                         <li><strong>Daily Loss Limit:</strong> ${fundedDailyDD}% (Trailing EOD)</li>`
                      : `<li><strong>Maximum Drawdown:</strong> ${fundedMaxDD}% (Static)</li>
                         <li><strong>Daily Loss Limit:</strong> ${fundedDailyDD}% maximum</li>`
                    }
                  </ul>
                </td>
              </tr>
            </table>
            <p style="color: #4a5568;">Please review your open positions and maintain proper risk management.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">© 2024 Exodus. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
  };

  const generateCryptoOrderPreview = (name: string, challengeType: string, accountSize: number, orderId: string, cryptoType: string = 'BTC', cryptoAmount: string = '0.00025', usdAmount: number = 150) => {
    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #1e40af; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
      <h1 style="color: #60A5FA; margin: 0; font-size: 24px;">Thanks for your order!</h1>
    </div>
    <div style="margin-bottom: 30px;">
      <p>Hello ${name.split(' ')[0]},</p>
      <p>Thank you for purchasing our ${challengeType} Challenge. We're excited to see how you perform!</p>
      <p>We've received your crypto payment request and will verify the transaction. Once confirmed, we'll prepare your trading account credentials.</p>
    </div>
    <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
      <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Summary</h2>
      <p style="margin-bottom: 5px;"><strong>Order ID:</strong> ${orderId}</p>
      <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${challengeType}</p>
      <p style="margin-bottom: 5px;"><strong>Account Size:</strong> $${accountSize.toLocaleString()}</p>
      <p style="margin-bottom: 5px;"><strong>Platform:</strong> MT5</p>
      <p style="margin-bottom: 5px;"><strong>Payment Amount:</strong> ${cryptoAmount} ${cryptoType}</p>
      <p style="margin-bottom: 5px;"><strong>USD Value:</strong> $${usdAmount.toFixed(2)}</p>
    </div>
    <div style="margin-bottom: 30px;">
      <h2 style="color: #60A5FA; font-size: 18px; margin-bottom: 15px;">Next Steps</h2>
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 5px 0; color: #333;">1. Payment Verification</h3>
        <p style="margin: 0; color: #666;">We'll verify your crypto payment. This usually takes 30-60 minutes.</p>
      </div>
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 5px 0; color: #333;">2. Receive Your Login Credentials</h3>
        <p style="margin: 0; color: #666;">Once payment is confirmed, we'll send your login credentials to this email address.</p>
      </div>
    </div>
    <div style="margin-bottom: 30px;">
      <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:support@exodusprop.com" style="color: #60A5FA;">support@exodusprop.com</a>.</p>
      <p style="margin-bottom: 0;">Best regards,</p>
      <p style="margin-top: 5px;"><strong>The Exodus Team</strong></p>
    </div>
    <div style="background-color: #1e40af; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #e0e0e0;">
      <p style="margin-bottom: 5px;">© ${new Date().getFullYear()} Exodus. All rights reserved.</p>
      <p style="margin: 0;">This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>`.trim();
  };

  const generateAdminNotificationPreview = (name: string, email: string, challengeType: string, accountSize: number, orderId: string, paymentMethod: string = 'Card') => {
    return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #1e40af; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
      <h1 style="color: #60A5FA; margin: 0; font-size: 24px;">New Exodus Order</h1>
    </div>
    <div style="margin-bottom: 30px;">
      <p style="margin-bottom: 5px;"><strong>Order ID:</strong> ${orderId}</p>
      <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p style="margin-bottom: 5px;"><strong>Status:</strong> Completed</p>
    </div>
    <div style="margin-bottom: 30px;">
      <h2 style="color: #60A5FA; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h2>
      <p style="margin-bottom: 5px;"><strong>Name:</strong> ${name}</p>
      <p style="margin-bottom: 5px;"><strong>Email:</strong> ${email}</p>
      <p style="margin-bottom: 5px;"><strong>Phone:</strong> +1 (555) 123-4567</p>
      <p style="margin-bottom: 5px;"><strong>Country:</strong> United States</p>
    </div>
    <div style="margin-bottom: 30px;">
      <h2 style="color: #60A5FA; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Details</h2>
      <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${challengeType}</p>
      <p style="margin-bottom: 5px;"><strong>Account Size:</strong> $${accountSize.toLocaleString()}</p>
      <p style="margin-bottom: 5px;"><strong>Platform:</strong> MT5</p>
      <p style="margin-bottom: 5px;"><strong>Payment Method:</strong> ${paymentMethod}</p>
      <p style="margin-bottom: 5px;"><strong>Amount Paid:</strong> $${(accountSize * 0.1).toFixed(2)}</p>
    </div>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #666;">
      <p>This is an automated notification from Exodus.</p>
    </div>
  </div>
</body>
</html>`.trim();
  };

  const generateEmailPreview = () => {
    const name = formData.toName || '[Customer Name]';
    const accountSize = parseInt(formData.accountSize.replace(/[$,]/g, '')) || 25000;
    const orderId = 'EXO-' + Date.now().toString().slice(-8);

    let html = '';
    switch (selectedEmailType) {
      case 'login-credentials':
        html = generateLoginCredentialsPreview();
        break;
      case 'challenge-pass':
        html = generateChallengePassPreview(name, formData.challengeType, accountSize);
        break;
      case 'challenge-fail':
        html = generateChallengeFailPreview(name, formData.challengeType, accountSize, formData.breachType, formData.maxDrawdown, formData.dailyDrawdown);
        break;
      case 'drawdown-warning':
        html = generateDrawdownWarningPreview(name, formData.challengeType, accountSize, formData.currentDrawdown);
        break;
      case 'funded-pass':
        html = generateFundedPassPreview(name, accountSize);
        break;
      case 'funded-fail-1step':
        html = generateFundedFailPreview(name, accountSize, formData.breachType, formData.maxDrawdown, formData.dailyDrawdown, '1-step');
        break;
      case 'funded-fail-elite':
        html = generateFundedFailPreview(name, accountSize, formData.breachType, formData.maxDrawdown, formData.dailyDrawdown, 'elite');
        break;
      case 'funded-warning-1step':
        html = generateFundedWarningPreview(name, accountSize, formData.currentDrawdown, '1-step');
        break;
      case 'funded-warning-elite':
        html = generateFundedWarningPreview(name, accountSize, formData.currentDrawdown, 'elite');
        break;
      case 'crypto-order':
        html = generateCryptoOrderPreview(name, formData.challengeType, accountSize, orderId);
        break;
      case 'admin-notification':
        html = generateAdminNotificationPreview(name, formData.toEmail || 'customer@example.com', formData.challengeType, accountSize, orderId);
        break;
      default:
        html = generateLoginCredentialsPreview();
    }
    
    return html;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage({ type: '', text: '' });

    try {
      const accountSize = parseInt(formData.accountSize.replace(/[$,]/g, '')) || 25000;
      let response;
      let successMessage = '';

      // Use custom HTML if edited in code editor
      const htmlToSend = showCodeEditor ? editableHtml : generateEmailPreview();

      switch (selectedEmailType) {
        case 'login-credentials':
          response = await fetch('/api/send-template-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: formData.toEmail,
              subject: `Your Exodus Trading Challenge Login Details - ${formData.platform}`,
              templateVars: {
                '{CUSTOMER_NAME}': formData.toName,
                '{LOGIN}': formData.login,
                '{PASSWORD}': formData.password,
                '{SERVER}': formData.server,
                '{PLATFORM}': formData.platform,
                '{ACCOUNT_SIZE}': formData.accountSize,
                '{CHALLENGE_TYPE}': formData.challengeType
              }
            }),
          });
          successMessage = 'Login credentials email sent successfully!';
          break;

        case 'challenge-pass':
          response = await fetch('/api/send-challenge-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'pass',
              email: formData.toEmail,
              name: formData.toName,
              challengeType: formData.challengeType,
              accountSize: accountSize,
              step: formData.challengeType,
              customHtml: showCodeEditor ? editableHtml : undefined
            }),
          });
          successMessage = 'Challenge pass email sent successfully!';
          break;

        case 'challenge-fail':
          response = await fetch('/api/send-challenge-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'fail',
              email: formData.toEmail,
              name: formData.toName,
              challengeType: formData.challengeType,
              accountSize: accountSize,
              breachType: formData.breachType,
              maxDrawdown: formData.maxDrawdown,
              dailyDrawdown: formData.dailyDrawdown,
              customHtml: showCodeEditor ? editableHtml : undefined
            }),
          });
          successMessage = 'Challenge fail email sent successfully!';
          break;

        case 'drawdown-warning':
          response = await fetch('/api/send-challenge-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'drawdown-warning',
              email: formData.toEmail,
              name: formData.toName,
              challengeType: formData.challengeType,
              accountSize: accountSize,
              currentDrawdown: formData.currentDrawdown,
              customHtml: showCodeEditor ? editableHtml : undefined
            }),
          });
          successMessage = 'Drawdown warning email sent successfully!';
          break;

        case 'funded-pass':
          response = await fetch('/api/send-challenge-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'funded-pass',
              email: formData.toEmail,
              name: formData.toName,
              accountSize: accountSize,
              customHtml: showCodeEditor ? editableHtml : undefined
            }),
          });
          successMessage = 'Funded pass email sent successfully!';
          break;

        case 'funded-fail-1step':
        case 'funded-fail-elite':
          response = await fetch('/api/send-challenge-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'funded-fail',
              email: formData.toEmail,
              name: formData.toName,
              accountSize: accountSize,
              breachType: formData.breachType,
              maxDrawdown: formData.maxDrawdown,
              dailyDrawdown: formData.dailyDrawdown,
              accountType: selectedEmailType === 'funded-fail-elite' ? 'elite' : '1-step',
              customHtml: showCodeEditor ? editableHtml : undefined
            }),
          });
          successMessage = `Funded fail email (${selectedEmailType === 'funded-fail-elite' ? 'Elite' : '1-Step'}) sent successfully!`;
          break;

        case 'funded-warning-1step':
        case 'funded-warning-elite':
          response = await fetch('/api/send-challenge-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'funded-drawdown-warning',
              email: formData.toEmail,
              name: formData.toName,
              accountSize: accountSize,
              currentDrawdown: formData.currentDrawdown,
              warningType: formData.currentDrawdown > 5 ? 'approaching-max' : 'approaching-daily',
              accountType: selectedEmailType === 'funded-warning-elite' ? 'elite' : '1-step',
              customHtml: showCodeEditor ? editableHtml : undefined
            }),
          });
          successMessage = `Funded warning email (${selectedEmailType === 'funded-warning-elite' ? 'Elite' : '1-Step'}) sent successfully!`;
          break;

        case 'crypto-order':
        case 'admin-notification':
          // Send using custom HTML endpoint
          response = await fetch('/api/send-custom-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: formData.toEmail,
              subject: selectedEmailType === 'crypto-order' 
                ? `Your Exodus ${formData.challengeType} Challenge Order`
                : `New Order: ${formData.challengeType} Challenge (${formData.accountSize})`,
              html: htmlToSend
            }),
          });
          successMessage = `${selectedEmailType === 'crypto-order' ? 'Crypto order' : 'Admin notification'} email sent successfully!`;
          break;

        default:
          throw new Error('Invalid email type');
      }

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setMessage({ type: 'success', text: successMessage });
      
      setTimeout(() => {
        setFormData({
          toEmail: '',
          toName: '',
          login: '',
          password: '',
          server: '',
          platform: 'MT5',
          accountSize: '$25,000',
          challengeType: '1-Step Challenge',
          accountType: '1-step',
          breachType: 'maxDrawdown',
          maxDrawdown: 7.5,
          dailyDrawdown: 5.2,
          currentDrawdown: 5.0
        });
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage({ type: 'error', text: 'Failed to send email. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout navItems={adminNavItems} userEmail={currentUserEmail} isAdmin={true}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Email Templates</h1>
          <p className="text-gray-300">View and send email templates to customers</p>
        </div>

        {/* Email Type Selector */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Select Email Template</label>
          <select
            value={selectedEmailType}
            onChange={(e) => setSelectedEmailType(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          >
            {emailTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Order Selection */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Select from Orders</h3>
              <button
                onClick={() => setShowOrderSelect(!showOrderSelect)}
                className="w-full px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Search size={16} />
                {showOrderSelect ? 'Hide Orders' : 'Select from Recent Orders'}
              </button>

              {showOrderSelect && (
                <div className="mt-4 space-y-3">
                  {/* Order Type Filter */}
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setOrderTypeFilter('all')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        orderTypeFilter === 'all'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      All Orders
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderTypeFilter('crypto')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        orderTypeFilter === 'crypto'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      Crypto
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderTypeFilter('card')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        orderTypeFilter === 'card'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      Card
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                  />
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredOrders.map(order => (
                      <button
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-900 border border-gray-700/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-white text-sm font-medium">{order.customerName}</div>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            order.orderType === 'crypto' 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {order.orderType === 'crypto' ? 'Crypto' : 'Card'}
                          </span>
                        </div>
                        <div className="text-gray-400 text-xs">{order.customerEmail}</div>
                        <div className="text-blue-400 text-xs mt-1">{order.challengeAmount} • {order.platform}</div>
                      </button>
                    ))}
                    {filteredOrders.length === 0 && (
                      <div className="text-center text-gray-500 py-4 text-sm">
                        No orders found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Email Form */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Customer Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.toEmail}
                    onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    placeholder="customer@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.toName}
                    onChange={(e) => setFormData({ ...formData, toName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    placeholder="John Doe"
                  />
                </div>

                {/* Login Credentials Specific Fields */}
                {selectedEmailType === 'login-credentials' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Login ID *</label>
                        <input
                          type="text"
                          required
                          value={formData.login}
                          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 font-mono"
                          placeholder="12345678"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                        <input
                          type="text"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 font-mono"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Server *</label>
                      <select
                        required
                        value={formData.server}
                        onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                      >
                        <option value="">Select Server</option>
                        <option value="FusionMarkets-Demo">FusionMarkets-Demo</option>
                        <option value="DominionMarkets-Live">DominionMarkets-Live</option>
                        <option value="AXI-US03-DEMO">AXI-US03-DEMO</option>
                        <option value="ADMIRALSGROUP-DEMO">ADMIRALSGROUP-DEMO</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Drawdown/Fail Email Fields */}
                {(selectedEmailType === 'challenge-fail' || selectedEmailType === 'funded-fail-1step' || selectedEmailType === 'funded-fail-elite') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Breach Type</label>
                      <select
                        value={formData.breachType}
                        onChange={(e) => setFormData({ ...formData, breachType: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                      >
                        <option value="maxDrawdown">Max Drawdown</option>
                        <option value="riskViolation">Daily Loss</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Max Drawdown %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.maxDrawdown}
                          onChange={(e) => setFormData({ ...formData, maxDrawdown: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                          placeholder="7.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Daily Drawdown %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.dailyDrawdown}
                          onChange={(e) => setFormData({ ...formData, dailyDrawdown: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                          placeholder="5.2"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Warning Email Fields */}
                {(selectedEmailType === 'drawdown-warning' || selectedEmailType === 'funded-warning-1step' || selectedEmailType === 'funded-warning-elite') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Drawdown %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.currentDrawdown}
                      onChange={(e) => setFormData({ ...formData, currentDrawdown: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                      placeholder="5.0"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option>MT4</option>
                      <option>MT5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Account Size</label>
                    <select
                      value={formData.accountSize}
                      onChange={(e) => setFormData({ ...formData, accountSize: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option>$5,000</option>
                      <option>$10,000</option>
                      <option>$25,000</option>
                      <option>$50,000</option>
                      <option>$100,000</option>
                      <option>$200,000</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    sending
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {sending ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Email Preview */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {showCodeEditor ? <Code className="text-blue-500" size={20} /> : <Eye className="text-blue-500" size={20} />}
                <h3 className="text-lg font-semibold text-white">
                  {showCodeEditor ? 'Code Editor' : 'Email Preview'}: {emailTypes.find(t => t.value === selectedEmailType)?.label}
                </h3>
              </div>
              <button
                onClick={() => setShowCodeEditor(!showCodeEditor)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white border border-gray-600/50 rounded-lg transition-colors text-sm"
              >
                {showCodeEditor ? (
                  <>
                    <Eye size={16} />
                    <span>Show Preview</span>
                  </>
                ) : (
                  <>
                    <Code size={16} />
                    <span>Show Code</span>
                  </>
                )}
              </button>
            </div>

            {showCodeEditor ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <strong className="text-yellow-400">Note:</strong> Edit the HTML code below. Your changes will be used when sending the email.
                </div>
                <textarea
                  value={editableHtml}
                  onChange={(e) => setEditableHtml(e.target.value)}
                  className="w-full h-[600px] px-4 py-3 bg-gray-900/80 border border-gray-700/50 rounded-lg text-gray-300 font-mono text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <iframe
                  srcDoc={generateEmailPreview()}
                  title="Email Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "@/components/DashboardLayout";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "@/lib/auth-helpers";
import { 
  Check, 
  X, 
  Trash2, 
  Clock, 
  RefreshCw,
  Search,
  ChevronDown,
  Filter,
  ChevronRight,
  ChevronUp,
  Copy
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface CryptoOrder {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  challengeStatus?: 'IN_PROGRESS' | 'FAILED' | 'PASSED';
  cryptoType: string;
  cryptoAmount: string;
  cryptoAddress: string;
  usdAmount: number;
  verificationPhrase: string;
  challengeType: string;
  challengeAmount: string;
  platform: string;
  addOns?: string[];
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerCountry: string;
  customerDiscordUsername?: string;
  discountCode?: string;
  discountId?: string;
  originalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function CryptoOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CryptoOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cryptoFilter, setCryptoFilter] = useState<'ALL' | 'BTC' | 'ETH' | 'USDT' | 'USDC'>('ALL');
  const [challengeStatusFilter, setChallengeStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'FAILED' | 'PASSED'>('ALL');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [copiedText, setCopiedText] = useState<string | null>(null);

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
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Subscribe to crypto orders collection
    const q = query(collection(db, 'crypto-orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: CryptoOrder[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as CryptoOrder);
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
    try {
      const orderRef = doc(db, 'crypto-orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      // If order is marked as completed, send success email
      if (newStatus === 'COMPLETED') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          try {
            const response = await fetch('/api/send-crypto-emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...order,
                id: orderId,
                status: newStatus
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to send emails');
            }
          } catch (error) {
            console.error('Error sending emails:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteDoc(doc(db, 'crypto-orders', orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const toggleRowExpansion = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getStats = () => {
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, order) => sum + order.usdAmount, 0);
    const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
    const passedChallenges = orders.filter(order => order.challengeStatus === 'PASSED').length;
    const failedChallenges = orders.filter(order => order.challengeStatus === 'FAILED').length;
    const inProgressChallenges = orders.filter(order => order.challengeStatus === 'IN_PROGRESS').length;

    return {
      totalOrders,
      totalValue,
      completedOrders,
      passedChallenges,
      failedChallenges,
      inProgressChallenges
    };
  };

  const handleChallengeStatusChange = async (orderId: string, newStatus: 'IN_PROGRESS' | 'FAILED' | 'PASSED') => {
    try {
      const orderRef = doc(db, 'crypto-orders', orderId);
      await updateDoc(orderRef, { 
        challengeStatus: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating challenge status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.verificationPhrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cryptoAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesCrypto = cryptoFilter === 'ALL' || order.cryptoType === cryptoFilter;
    const matchesChallengeStatus = challengeStatusFilter === 'ALL' || order.challengeStatus === challengeStatusFilter;

    return matchesSearch && matchesStatus && matchesCrypto && matchesChallengeStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-exodus-blue via-exodus-blue to-exodus-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={adminNavItems} userEmail={currentUserEmail} isAdmin={true}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Crypto Orders</h1>
            <p className="text-gray-300">Manage cryptocurrency payment orders</p>
          </div>
          <button
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="text-gray-400 text-sm">Total Orders</div>
          <div className="text-2xl font-bold text-white">{getStats().totalOrders}</div>
        </div>
        
        {/* Total Value */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="text-gray-400 text-sm">Total Value</div>
          <div className="text-2xl font-bold text-blue-500">${getStats().totalValue.toFixed(2)}</div>
        </div>

        {/* Completed Orders */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="text-gray-400 text-sm">Completed Orders</div>
          <div className="text-2xl font-bold text-white">{getStats().completedOrders}</div>
        </div>

        {/* Passed Challenges */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="text-gray-400 text-sm">Passed Challenges</div>
          <div className="text-2xl font-bold text-green-400">{getStats().passedChallenges}</div>
        </div>

        {/* Failed Challenges */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="text-gray-400 text-sm">Failed Challenges</div>
          <div className="text-2xl font-bold text-red-400">{getStats().failedChallenges}</div>
        </div>

        {/* In Progress Challenges */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="text-gray-400 text-sm">In Progress</div>
          <div className="text-2xl font-bold text-yellow-400">{getStats().inProgressChallenges}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by email, name, phrase, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500/50"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={cryptoFilter}
            onChange={(e) => setCryptoFilter(e.target.value as any)}
            className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500/50"
          >
            <option value="ALL">All Crypto</option>
            <option value="BTC">Bitcoin</option>
            <option value="ETH">Ethereum</option>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={challengeStatusFilter}
            onChange={(e) => setChallengeStatusFilter(e.target.value as any)}
            className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500/50"
          >
            <option value="ALL">All Challenge Status</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FAILED">Failed</option>
            <option value="PASSED">Passed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"></th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Challenge</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <>
                  <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleRowExpansion(order.id)}
                        className="p-1 hover:bg-gray-700/20 rounded"
                      >
                        {expandedRows.has(order.id) ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="text-white">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-medium text-white">{order.customerName}</div>
                          <div className="text-sm text-gray-400">{order.customerEmail}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(order.customerName);
                            }}
                            className="p-1 hover:bg-gray-700/20 rounded transition-colors"
                            title="Copy name"
                          >
                            {copiedText === order.customerName ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} className="text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(order.customerEmail);
                            }}
                            className="p-1 hover:bg-gray-700/20 rounded transition-colors"
                            title="Copy email"
                          >
                            {copiedText === order.customerEmail ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-white">{order.challengeType}</div>
                      <div className="text-sm text-gray-400">{order.challengeAmount}</div>
                      <div className="text-xs text-blue-500 mt-1">{order.platform}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-white">${order.usdAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">
                        {order.cryptoAmount} {order.cryptoType}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'COMPLETED' ? 'bg-green-400/10 text-green-400' :
                          order.status === 'CANCELLED' ? 'bg-red-400/10 text-red-400' :
                          'bg-yellow-400/10 text-yellow-400'
                        }`}>
                          {order.status === 'COMPLETED' && <Check size={12} className="mr-1" />}
                          {order.status === 'CANCELLED' && <X size={12} className="mr-1" />}
                          {order.status === 'PENDING' && <Clock size={12} className="mr-1" />}
                          {order.status}
                        </span>
                        
                        {/* Challenge Status Badge */}
                        {order.challengeStatus && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.challengeStatus === 'PASSED' ? 'bg-green-400/10 text-green-400' :
                            order.challengeStatus === 'FAILED' ? 'bg-red-400/10 text-red-400' :
                            'bg-yellow-400/10 text-yellow-400'
                          }`}>
                            {order.challengeStatus === 'PASSED' && <Check size={12} className="mr-1" />}
                            {order.challengeStatus === 'FAILED' && <X size={12} className="mr-1" />}
                            {order.challengeStatus === 'IN_PROGRESS' && <Clock size={12} className="mr-1" />}
                            {order.challengeStatus.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {/* Challenge Status Controls */}
                        <div className="flex items-center gap-1 border-r border-gray-700/50 pr-2 mr-2">
                          <button
                            onClick={() => handleChallengeStatusChange(order.id, 'IN_PROGRESS')}
                            className={`p-1.5 rounded transition-colors ${
                              order.challengeStatus === 'IN_PROGRESS' 
                                ? 'bg-yellow-400/20 text-yellow-400' 
                                : 'text-gray-400 hover:bg-gray-700/20'
                            }`}
                            title="Mark Challenge as In Progress"
                          >
                            <Clock size={16} />
                          </button>
                          <button
                            onClick={() => handleChallengeStatusChange(order.id, 'FAILED')}
                            className={`p-1.5 rounded transition-colors ${
                              order.challengeStatus === 'FAILED' 
                                ? 'bg-red-400/20 text-red-400' 
                                : 'text-gray-400 hover:bg-gray-700/20'
                            }`}
                            title="Mark Challenge as Failed"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={() => handleChallengeStatusChange(order.id, 'PASSED')}
                            className={`p-1.5 rounded transition-colors ${
                              order.challengeStatus === 'PASSED' 
                                ? 'bg-green-400/20 text-green-400' 
                                : 'text-gray-400 hover:bg-gray-700/20'
                            }`}
                            title="Mark Challenge as Passed"
                          >
                            <Check size={16} />
                          </button>
                        </div>

                        {/* Original Order Status Controls */}
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                              className="p-1 text-green-400 hover:bg-green-400/10 rounded"
                              title="Mark Order as Completed"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                              className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                              title="Mark Order as Cancelled"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(order.id) && (
                    <tr className="bg-gray-800/20">
                      <td colSpan={7} className="px-8 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {/* Customer Details */}
                          <div>
                            <h3 className="text-blue-500 font-medium mb-2">Customer Details</h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <div className="text-gray-400">Full Name</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-white">{order.customerName}</span>
                                  <button
                                    onClick={() => handleCopy(order.customerName)}
                                    className="p-1 hover:bg-gray-700/20 rounded"
                                    title="Copy name"
                                  >
                                    {copiedText === order.customerName ? (
                                      <Check size={12} className="text-green-400" />
                                    ) : (
                                      <Copy size={12} className="text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400">Email</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-white">{order.customerEmail}</span>
                                  <button
                                    onClick={() => handleCopy(order.customerEmail)}
                                    className="p-1 hover:bg-gray-700/20 rounded"
                                    title="Copy email"
                                  >
                                    {copiedText === order.customerEmail ? (
                                      <Check size={12} className="text-green-400" />
                                    ) : (
                                      <Copy size={12} className="text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400">Phone</div>
                                <div className="text-white">{order.customerPhone || 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Country</div>
                                <div className="text-white">{order.customerCountry}</div>
                              </div>
                              {order.customerDiscordUsername && (
                                <div>
                                  <div className="text-gray-400">Discord</div>
                                  <div className="text-white">{order.customerDiscordUsername}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Challenge Details */}
                          <div>
                            <h3 className="text-blue-500 font-medium mb-2">Challenge Details</h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <div className="text-gray-400">Type</div>
                                <div className="text-white">{order.challengeType}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Amount</div>
                                <div className="text-white">{order.challengeAmount}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Platform</div>
                                <div className="text-white">{order.platform}</div>
                              </div>
                              {order.discountCode && (
                                <div>
                                  <div className="text-gray-400">Discount Applied</div>
                                  <div className="text-white">{order.discountCode}</div>
                                </div>
                              )}
                              {order.originalAmount && (
                                <div>
                                  <div className="text-gray-400">Original Price</div>
                                  <div className="text-white">${order.originalAmount.toFixed(2)}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div>
                            <h3 className="text-blue-500 font-medium mb-2">Payment Details</h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <div className="text-gray-400">Crypto Type</div>
                                <div className="text-white">{order.cryptoType}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Crypto Amount</div>
                                <div className="text-white">{order.cryptoAmount} {order.cryptoType}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">USD Amount</div>
                                <div className="text-white">${order.usdAmount.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Wallet Address</div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs truncate text-white max-w-[200px]">{order.cryptoAddress}</span>
                                  <button
                                    onClick={() => handleCopy(order.cryptoAddress)}
                                    className="p-1 hover:bg-gray-700/20 rounded"
                                  >
                                    {copiedText === order.cryptoAddress ? (
                                      <Check size={14} className="text-green-400" />
                                    ) : (
                                      <Copy size={14} className="text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400">Verification Phrase</div>
                                <div className="font-mono text-xs text-white">{order.verificationPhrase}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </DashboardLayout>
  );
}


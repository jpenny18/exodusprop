'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from "@/components/DashboardLayout";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "@/lib/auth-helpers";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { 
  CreditCard, 
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Mail,
  User,
  MapPin,
  Calendar,
  Trash2
} from 'lucide-react';

interface CardOrder {
  id: string;
  userId: string;
  email: string;
  accountSize: string;
  accountPrice: number;
  platform: string;
  planId: string;
  receiptId: string;
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
  status: string;
  paymentMethod: string;
}

export default function CardOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'completed' | 'pending'>('ALL');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const adminNavItems = [
    { name: "Admin Dashboard", href: "/admin", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>) },
    { name: "Crypto Orders", href: "/admin/crypto-orders", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" /></svg>) },
    { name: "Card Orders", href: "/admin/card-orders", icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>) },
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
    // Subscribe to purchases collection (card payments)
    const q = query(collection(db, 'purchases'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: CardOrder[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only include card payments
        if (data.paymentMethod === 'card' || !data.paymentMethod) {
          ordersData.push({ id: doc.id, ...data } as CardOrder);
        }
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleRowExpansion = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleDeleteOrder = async (orderId: string, orderEmail: string) => {
    if (!confirm(`Are you sure you want to delete the order for ${orderEmail}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'purchases', orderId));
      alert('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
    }
  };

  const getStats = () => {
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, order) => sum + order.accountPrice, 0);
    const completedOrders = orders.filter(order => order.status === 'completed').length;

    return {
      totalOrders,
      totalValue,
      completedOrders,
    };
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.billingInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.billingInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Card Orders</h1>
            <p className="text-gray-300">Manage card payment orders via Whop</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <div className="text-gray-400 text-sm">Total Orders</div>
            <div className="text-2xl font-bold text-white">{getStats().totalOrders}</div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <div className="text-gray-400 text-sm">Total Value</div>
            <div className="text-2xl font-bold text-blue-500">${getStats().totalValue.toFixed(2)}</div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <div className="text-gray-400 text-sm">Completed</div>
            <div className="text-2xl font-bold text-green-400">{getStats().completedOrders}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  statusFilter === 'ALL'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Filter size={16} />
                All
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr className="text-left text-gray-400 text-sm">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Account Size</th>
                <th className="p-4 font-medium">Platform</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Details</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    No card orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <>
                    <tr key={order.id} className="border-t border-gray-700/50 hover:bg-gray-700/20">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <div>
                            <div className="text-white font-medium">
                              {order.billingInfo.firstName} {order.billingInfo.lastName}
                            </div>
                            <div className="text-gray-400 text-xs">{order.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-semibold">{order.accountSize}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                          {order.platform}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-green-400 font-semibold">${order.accountPrice}</span>
                      </td>
                      <td className="p-4 text-gray-300 text-sm">
                        {new Date(order.timestamp).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleRowExpansion(order.id)}
                          className="text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          {expandedRows.has(order.id) ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.email)}
                          className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded"
                          title="Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(order.id) && (
                      <tr className="border-t border-gray-700/50 bg-gray-900/30">
                        <td colSpan={8} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Details */}
                            <div className="space-y-3">
                              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <User size={16} className="text-blue-500" />
                                Customer Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail size={14} className="text-gray-400" />
                                  <span className="text-gray-400">Email:</span>
                                  <span className="text-white">{order.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} className="text-gray-400" />
                                  <span className="text-gray-400">Address:</span>
                                  <span className="text-white">
                                    {order.billingInfo.streetAddress}, {order.billingInfo.city}, {order.billingInfo.state}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} className="text-gray-400" />
                                  <span className="text-gray-400">Country:</span>
                                  <span className="text-white">{order.billingInfo.country}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">Postal Code:</span>
                                  <span className="text-white">{order.billingInfo.postalCode}</span>
                                </div>
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-3">
                              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <CreditCard size={16} className="text-green-500" />
                                Order Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-400">Plan ID:</span>
                                  <span className="text-white ml-2 font-mono text-xs">{order.planId}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Receipt ID:</span>
                                  <span className="text-white ml-2 font-mono text-xs">{order.receiptId}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Payment Method:</span>
                                  <span className="text-white ml-2">Card (Whop)</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">User ID:</span>
                                  <span className="text-white ml-2 font-mono text-xs">{order.userId.substring(0, 16)}...</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-gray-400" />
                                  <span className="text-gray-400">Created:</span>
                                  <span className="text-white">{new Date(order.timestamp).toLocaleString()}</span>
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


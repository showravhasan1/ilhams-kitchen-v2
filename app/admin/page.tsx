"use client";

import { useState, useMemo } from 'react';
import { Package, Truck, CheckCircle, XCircle, Search, DollarSign, Clock } from 'lucide-react';

interface Order {
    id: string;
    createdAt: string;
    name: string;
    phone: string;
    address: string;
    zone: string;
    item: string;
    quantity: number;
    total: number;
    status: string;
}

export default function AdminDashboard() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async (pwd: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/orders?password=${pwd}`);
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
                setIsAuthenticated(true);
            } else {
                alert('ভুল পাসওয়ার্ড!');
            }
        } catch (error) {
            console.error(error);
            alert('সার্ভার এরর!');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrders(password);
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/admin/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, password })
            });
            const data = await res.json();
            if (data.success) {
                setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            } else {
                alert('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Derived State Computations
    const filteredOrders = useMemo(() => {
        return orders.filter(o =>
            o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.phone.includes(searchTerm)
        );
    }, [orders, searchTerm]);

    const totalRevenue = useMemo(() => orders.reduce((acc, curr) => acc + curr.total, 0), [orders]);
    const pendingCount = useMemo(() => orders.filter(o => o.status === 'Pending').length, [orders]);

    // Fast Date Formatting Helper
    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return {
            date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
                    <h2 className="text-2xl font-bold text-center mb-6">এডমিন লগইন</h2>
                    <input
                        type="password"
                        placeholder="পাসওয়ার্ড দিন"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 mb-4 focus:ring-2 focus:ring-orange-500 outline-none text-center tracking-widest"
                    />
                    <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition shadow-md">
                        {loading ? 'অপেক্ষা করুন...' : 'প্রবেশ করুন'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">অর্ডার ড্যাশবোর্ড</h1>
                        <p className="text-gray-500 mt-1">সব অর্ডার ম্যানেজ করুন এবং আপডেট করুন</p>
                    </div>
                    <button onClick={() => fetchOrders(password)} className="bg-orange-100 text-orange-700 px-5 py-2.5 rounded-xl font-bold hover:bg-orange-200 transition shadow-sm">
                        রিফ্রেশ করুন
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        {orders.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                                        <Package size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">সর্বমোট অর্ডার</p>
                                        <p className="text-2xl font-extrabold text-gray-900">{orders.length} <span className="text-lg font-medium text-gray-500">টি</span></p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                                        <DollarSign size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">সর্বমোট বিক্রি</p>
                                        <p className="text-2xl font-extrabold text-gray-900">{totalRevenue.toLocaleString()} <span className="text-lg font-medium text-gray-500">৳</span></p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                                    <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shadow-inner">
                                        <Clock size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">পেন্ডিং অর্ডার</p>
                                        <p className="text-2xl font-extrabold text-gray-900">{pendingCount} <span className="text-lg font-medium text-gray-500">টি</span></p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="নাম বা মোবাইল নাম্বার দিয়ে খুঁজুন..."
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold text-left tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">তারিখ</th>
                                            <th className="px-6 py-4">কাস্টমার</th>
                                            <th className="px-6 py-4">ঠিকানা</th>
                                            <th className="px-6 py-4">অর্ডার ডিটেইলস</th>
                                            <th className="px-6 py-4">মোট ট্রানজেকশন</th>
                                            <th className="px-6 py-4">স্ট্যাটাস লেবেল</th>
                                            <th className="px-6 py-4 text-center">নতুন স্ট্যাটাস</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredOrders.length === 0 ? (
                                            <tr><td colSpan={7} className="text-center py-16 text-gray-500 font-semibold text-lg">কোনো অর্ডার পাওয়া যায়নি</td></tr>
                                        ) : filteredOrders.map((order) => {
                                            const { date, time } = formatDate(order.createdAt);
                                            return (
                                                <tr key={order.id} className="hover:bg-orange-50/50 transition duration-150">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-semibold text-gray-900">{date}</div>
                                                        <div className="text-xs text-gray-500 font-medium">{time}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{order.name}</div>
                                                        <div className="text-sm text-gray-600 font-medium font-mono tracking-tight">{order.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-700 max-w-[200px] line-clamp-2 leading-snug" title={order.address}>{order.address}</div>
                                                        <div className="text-xs font-bold text-orange-600 mt-1 uppercase tracking-wide">{order.zone === 'Dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md">
                                                            <Package size={14} className="text-gray-500" />
                                                            <span className="font-bold text-gray-900 text-sm">{order.item}</span>
                                                            <span className="text-gray-500 text-sm font-semibold">x {order.quantity}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-black text-gray-900 text-lg">৳{order.total}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    'bg-red-50 text-red-700 border-red-200'
                                                            }`}>
                                                            {order.status === 'Pending' && <Clock size={12} className="mr-1" />}
                                                            {order.status === 'Shipped' && <Truck size={12} className="mr-1" />}
                                                            {order.status === 'Delivered' && <CheckCircle size={12} className="mr-1" />}
                                                            {order.status === 'Cancelled' && <XCircle size={12} className="mr-1" />}
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm font-medium">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                                            className="border-2 border-gray-200 pl-3 pr-8 py-1.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer text-gray-700 font-semibold shadow-sm transition"
                                                        >
                                                            <option value="Pending">🕒 Pending</option>
                                                            <option value="Shipped">🚚 Shipped</option>
                                                            <option value="Delivered">✅ Delivered</option>
                                                            <option value="Cancelled">❌ Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

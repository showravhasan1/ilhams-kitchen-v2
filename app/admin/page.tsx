"use client";

import { useState } from 'react';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

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
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 mb-4 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition">
                        {loading ? 'অপেক্ষা করুন...' : 'প্রবেশ করুন'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">অর্ডার ড্যাশবোর্ড</h1>
                    <button onClick={() => fetchOrders(password)} className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200 transition">
                        রিফ্রেশ
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-12">লোডিং...</p>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold text-left">
                                    <tr>
                                        <th className="px-6 py-4">তারিখ</th>
                                        <th className="px-6 py-4">কাস্টমার</th>
                                        <th className="px-6 py-4">ঠিকানা</th>
                                        <th className="px-6 py-4">আইটেম</th>
                                        <th className="px-6 py-4">মোট বিল</th>
                                        <th className="px-6 py-4">স্ট্যাটাস</th>
                                        <th className="px-6 py-4">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-8 text-gray-500">কোনো অর্ডার নেই</td></tr>
                                    ) : orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-GB')}<br />
                                                {new Date(order.createdAt).toLocaleTimeString('en-GB')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{order.name}</div>
                                                <div className="text-sm text-gray-500">{order.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700 max-w-[200px] truncate" title={order.address}>{order.address}</div>
                                                <div className="text-xs text-gray-400 mt-1">{order.zone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold">{order.item}</span> x {order.quantity}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-orange-600">
                                                {order.total}৳
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                                'bg-red-100 text-red-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    className="text-sm border pl-2 pr-6 py-1 rounded-lg bg-white outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useMemo } from 'react';
import { Package, Truck, CheckCircle, XCircle, Search, DollarSign, Clock, Download, Printer, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

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

    // Feature States
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

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

    const deleteOrder = async (id: string) => {
        if (!confirm('আপনি কি নিশ্চিত যে আপনি এই অর্ডারটি ডিলিট করতে চান?')) return;
        try {
            const res = await fetch(`/api/admin/orders?id=${id}&password=${password}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setOrders(orders.filter(o => o.id !== id));
            } else {
                alert('অর্ডার ডিলিট ব্যর্থ হয়েছে!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const exportToCSV = () => {
        if (orders.length === 0) return;
        const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Zone', 'Item', 'Quantity', 'Total (BDT)', 'Status'];
        const csvRows = [
            headers.join(','), // Header row
            ...filteredOrders.map(o => [
                o.id,
                `"${new Date(o.createdAt).toLocaleString('en-GB')}"`,
                `"${o.name}"`,
                `"${o.phone}"`,
                `"${o.address}"`,
                o.zone,
                o.item,
                o.quantity,
                o.total,
                o.status
            ].join(','))
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.hidden = true;
        a.href = url;
        a.download = `ilhams_kitchen_orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    // Derived State Computations
    const filteredOrders = useMemo(() => {
        let filtered = orders.filter(o =>
            o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.phone.includes(searchTerm)
        );

        const now = new Date();
        if (dateFilter === 'today') {
            filtered = filtered.filter(o => new Date(o.createdAt).toDateString() === now.toDateString());
        } else if (dateFilter === 'week') {
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(o => new Date(o.createdAt) >= lastWeek);
        } else if (dateFilter === 'month') {
            const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(o => new Date(o.createdAt) >= lastMonth);
        }

        return filtered;
    }, [orders, searchTerm, dateFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalRevenue = useMemo(() => filteredOrders.reduce((acc, curr) => acc + curr.total, 0), [filteredOrders]);
    const pendingCount = useMemo(() => filteredOrders.filter(o => o.status === 'Pending').length, [filteredOrders]);

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
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8 print:bg-white print:p-0">
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                }
            `}</style>

            <div className="max-w-7xl mx-auto">
                {/* Header (No Print) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 no-print">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">অর্ডার ড্যাশবোর্ড</h1>
                        <p className="text-gray-500 mt-1">সব অর্ডার ম্যানেজ করুন এবং আপডেট করুন</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={exportToCSV} className="bg-green-100 text-green-700 px-4 py-2.5 rounded-xl font-bold hover:bg-green-200 transition shadow-sm flex items-center gap-2">
                            <Download size={18} /> CSV ডাউনলোড
                        </button>
                        <button onClick={handlePrint} className="bg-blue-100 text-blue-700 px-4 py-2.5 rounded-xl font-bold hover:bg-blue-200 transition shadow-sm flex items-center gap-2">
                            <Printer size={18} /> প্রিন্ট ইনভয়েস
                        </button>
                        <button onClick={() => fetchOrders(password)} className="bg-orange-100 text-orange-700 px-5 py-2.5 rounded-xl font-bold hover:bg-orange-200 transition shadow-sm">
                            রিফ্রেশ করুন
                        </button>
                    </div>
                </div>

                {/* Print Title (Visible only when printing) */}
                <div className="hidden print:block mb-8 text-center pt-8">
                    <h1 className="text-2xl font-bold text-black border-b-2 border-black inline-block pb-2 mb-2">ILHAM's Kitchen - Packing Slips</h1>
                    <p className="text-gray-600">Printed on: {new Date().toLocaleDateString('en-GB')}</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 no-print">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        {orders.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 no-print">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                                        <Package size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">অর্ডার দেখাচ্ছে</p>
                                        <p className="text-2xl font-extrabold text-gray-900">{filteredOrders.length} <span className="text-lg font-medium text-gray-500">টি</span></p>
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

                        {/* Search Bar and Filters */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-4 no-print">
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="নাম বা মোবাইল নাম্বার দিয়ে খুঁজুন..."
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Calendar className="text-gray-400" size={18} />
                                </div>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                                    className="pl-11 pr-8 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm cursor-pointer appearance-none bg-white font-semibold text-gray-700"
                                >
                                    <option value="all">সব সময়</option>
                                    <option value="today">আজকের অর্ডার</option>
                                    <option value="week">গত ৭ দিন</option>
                                    <option value="month">গত ৩০ দিন</option>
                                </select>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 print:border-none print:shadow-none">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1000px] print:min-w-full">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold text-left tracking-wider print:bg-white print:text-black print:border-b-2">
                                        <tr>
                                            <th className="px-6 py-4">তারিখ</th>
                                            <th className="px-6 py-4">কাস্টমার</th>
                                            <th className="px-6 py-4">ঠিকানা</th>
                                            <th className="px-6 py-4">অর্ডার ডিটেইলস</th>
                                            <th className="px-6 py-4">মোট ট্রানজেকশন</th>
                                            <th className="px-6 py-4">স্ট্যাটাস লেবেল</th>
                                            <th className="px-6 py-4 text-center no-print">নতুন স্ট্যাটাস</th>
                                            <th className="px-6 py-4 text-center no-print">ডিলিট</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 print:divide-black">
                                        {paginatedOrders.length === 0 ? (
                                            <tr><td colSpan={8} className="text-center py-16 text-gray-500 font-semibold text-lg no-print">কোনো অর্ডার পাওয়া যায়নি</td></tr>
                                        ) : paginatedOrders.map((order) => {
                                            const { date, time } = formatDate(order.createdAt);
                                            return (
                                                <tr key={order.id} className="hover:bg-orange-50/50 transition duration-150 print:break-inside-avoid">
                                                    <td className="px-6 py-4 print:p-2">
                                                        <div className="text-sm font-semibold text-gray-900 print:text-black">{date}</div>
                                                        <div className="text-xs text-gray-500 font-medium print:hidden">{time}</div>
                                                    </td>
                                                    <td className="px-6 py-4 print:p-2">
                                                        <div className="font-bold text-gray-900 print:text-black">{order.name}</div>
                                                        <div className="text-sm text-gray-600 font-medium font-mono tracking-tight print:text-black">{order.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 print:p-2">
                                                        <div className="text-sm text-gray-700 max-w-[200px] line-clamp-2 leading-snug print:text-black print:line-clamp-none print:max-w-none" title={order.address}>{order.address}</div>
                                                        <div className="text-xs font-bold text-orange-600 mt-1 uppercase tracking-wide print:hidden">{order.zone === 'Dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 print:p-2">
                                                        <div className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md print:bg-white print:border print:border-black print:p-1">
                                                            <Package size={14} className="text-gray-500 print:hidden" />
                                                            <span className="font-bold text-gray-900 text-sm print:text-black">{order.item}</span>
                                                            <span className="text-gray-500 text-sm font-semibold print:text-black border-l pl-1 border-gray-300 ml-1 print:border-black">x {order.quantity}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 print:p-2">
                                                        <div className="font-black text-gray-900 text-lg print:text-black">৳{order.total}</div>
                                                    </td>
                                                    <td className="px-6 py-4 print:p-2">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border print:border-black print:text-black print:bg-white ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    'bg-red-50 text-red-700 border-red-200'
                                                            }`}>
                                                            {order.status === 'Pending' && <Clock size={12} className="mr-1 print:hidden" />}
                                                            {order.status === 'Shipped' && <Truck size={12} className="mr-1 print:hidden" />}
                                                            {order.status === 'Delivered' && <CheckCircle size={12} className="mr-1 print:hidden" />}
                                                            {order.status === 'Cancelled' && <XCircle size={12} className="mr-1 print:hidden" />}
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm font-medium no-print">
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
                                                    <td className="px-6 py-4 text-center no-print border-l border-gray-100">
                                                        <button
                                                            onClick={() => deleteOrder(order.id)}
                                                            className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition mx-auto"
                                                            title="Delete Order"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 no-print">
                                <p className="text-gray-500 text-sm font-medium">দেখাচ্ছে {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} মোট {filteredOrders.length} অর্ডারের মধ্যে</p>
                                <div className="flex gap-2 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 text-gray-500 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-500 font-semibold w-10 h-10 flex items-center justify-center hover:bg-orange-50 rounded-lg transition"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="flex items-center px-4 font-bold text-gray-900 border-l border-r border-gray-100">পেজ {currentPage}</span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 text-gray-500 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-500 font-semibold w-10 h-10 flex items-center justify-center hover:bg-orange-50 rounded-lg transition"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

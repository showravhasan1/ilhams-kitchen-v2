"use client";

import { useState, useMemo, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Search, DollarSign, Clock, Download, Printer, Trash2, Calendar, ChevronLeft, ChevronRight, MessageCircle, Copy } from 'lucide-react';

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
    const [activeTab, setActiveTab] = useState('Pending');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Printing State
    const [printOrder, setPrintOrder] = useState<Order | null>(null);

    const fetchOrders = async (pwd: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/orders?password=${pwd}`);
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
                setIsAuthenticated(true);
                sessionStorage.setItem('adminAuth', pwd);
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

    useEffect(() => {
        const savedAuth = sessionStorage.getItem('adminAuth');
        if (savedAuth) {
            setPassword(savedAuth);
            fetchOrders(savedAuth);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
        setOrders([]);
        sessionStorage.removeItem('adminAuth');
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

    const handlePrintOrder = (order: Order) => {
        setPrintOrder(order);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    // Derived State Computations
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        // 1. Filter by Active Tab
        if (activeTab !== 'All') {
            filtered = filtered.filter(o => o.status === activeTab);
        }

        // 2. Filter by Search Term
        if (searchTerm) {
            filtered = filtered.filter(o =>
                o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.phone.includes(searchTerm)
            );
        }

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
    }, [orders, searchTerm, dateFilter, activeTab]);

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
                    @page { margin: 0; size: auto; }
                    body { background: white; margin: 1cm; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>

            {/* ONLY RENDERED DURING PRINTING */}
            {printOrder && (
                <div className="hidden print:block w-full max-w-2xl mx-auto border-4 border-black p-8 rounded-xl">
                    <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-6">
                        <div className="flex items-center gap-4">
                            <img src="/logo.png" alt="ILHAM's Kitchen Logo" className="w-[80px] h-[80px] object-contain" />
                            <div>
                                <h1 className="text-4xl font-black tracking-tight uppercase">ILHAM's Kitchen</h1>
                                <p className="text-gray-600 font-medium mt-1">Premium Peyaj Beresta</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-400">Packing Slip</h2>
                            <p className="font-mono mt-1 text-sm bg-gray-100 px-2 py-1 rounded inline-block">#{printOrder.id.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Ship To:</h3>
                            <p className="font-bold text-2xl mb-1">{printOrder.name}</p>
                            <p className="font-mono text-xl mb-3">{printOrder.phone}</p>
                            <p className="text-gray-900 leading-relaxed text-lg max-w-[250px]">{printOrder.address}</p>
                            <p className="mt-3 text-sm font-bold text-white uppercase tracking-wider bg-black px-4 py-1.5 inline-block rounded-md">{printOrder.zone === 'Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Order Date:</h3>
                            <p className="font-bold text-lg">{new Date(printOrder.createdAt).toLocaleDateString('en-GB')}</p>
                            <p className="text-gray-600">{new Date(printOrder.createdAt).toLocaleTimeString('en-GB')}</p>

                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-2 mt-6">Payment Method:</h3>
                            <p className="font-bold text-lg border-2 border-black px-3 py-1 inline-block rounded-md uppercase tracking-wider">Cash on Delivery</p>
                        </div>
                    </div>

                    <table className="w-full mb-8 border-collapse mt-8">
                        <thead>
                            <tr className="border-b-2 border-t-2 border-black bg-gray-100">
                                <th className="text-left font-bold uppercase py-4 px-3">Item Description</th>
                                <th className="text-center font-bold uppercase py-4 px-3">Qty</th>
                                <th className="text-right font-bold uppercase py-4 px-3">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b-2 border-gray-200">
                                <td className="py-6 px-3 font-bold text-xl text-gray-900">Premium Peyaj Beresta - {printOrder.item}</td>
                                <td className="text-center py-6 px-3 font-black text-2xl">{printOrder.quantity}</td>
                                <td className="text-right py-6 px-3 font-bold text-xl">৳{printOrder.total - (printOrder.zone === 'Dhaka' ? 70 : 130)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex justify-end mb-12">
                        <div className="w-1/2">
                            <div className="flex justify-between py-2 border-b border-gray-200 text-lg">
                                <span className="font-semibold text-gray-600">Subtotal:</span>
                                <span>৳{printOrder.total - (printOrder.zone === 'Dhaka' ? 70 : 130)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200 text-lg">
                                <span className="font-semibold text-gray-600">Delivery Charge:</span>
                                <span>৳{printOrder.zone === 'Dhaka' ? 70 : 130}</span>
                            </div>
                            <div className="flex justify-between py-4 border-b-4 border-black mt-2 bg-gray-100 px-3 rounded text-2xl">
                                <span className="font-black">TOTAL DUE (COD):</span>
                                <span className="font-black">৳{printOrder.total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-400 pt-8 mt-12 text-center pb-4">
                        <p className="font-black text-2xl mb-2">Thank you for your order!</p>
                        <p className="text-gray-600 font-medium text-lg">For any queries, contact us on WhatsApp: <strong>01679226855</strong></p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto no-print">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">অর্ডার ড্যাশবোর্ড</h1>
                        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">সব অর্ডার ম্যানেজ করুন এবং আপডেট করুন</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 flex-wrap sm:flex-nowrap">
                        <button onClick={exportToCSV} className="flex-1 sm:flex-none justify-center bg-green-100 text-green-700 px-4 py-2.5 rounded-xl font-bold hover:bg-green-200 transition shadow-sm flex items-center gap-2 text-sm sm:text-base">
                            <Download size={18} /> CSV
                        </button>
                        <button onClick={() => fetchOrders(password)} className="flex-1 sm:flex-none justify-center bg-orange-100 text-orange-700 px-5 py-2.5 rounded-xl font-bold hover:bg-orange-200 transition shadow-sm text-sm sm:text-base">
                            রিফ্রেশ
                        </button>
                        <button onClick={handleLogout} className="flex-1 sm:flex-none justify-center bg-red-100 text-red-700 px-5 py-2.5 rounded-xl font-bold hover:bg-red-200 transition shadow-sm text-sm sm:text-base">
                            লগআউট
                        </button>
                    </div>
                </div>

                {/* Workflow Tabs */}
                {isAuthenticated && (
                    <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                        {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-all ${activeTab === tab
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                {tab}
                                {tab !== 'All' && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {orders.filter(o => o.status === tab).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        {orders.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
                                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-5 col-span-2 md:col-span-1">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                                        <Package size={20} className="sm:hidden" />
                                        <Package size={28} className="hidden sm:block" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold text-gray-500 truncate">অর্ডার দেখাচ্ছে</p>
                                        <p className="text-lg sm:text-2xl font-extrabold text-gray-900">{filteredOrders.length} <span className="text-sm sm:text-lg font-medium text-gray-500">টি</span></p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-5">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                                        <DollarSign size={20} className="sm:hidden" />
                                        <DollarSign size={28} className="hidden sm:block" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold text-gray-500 truncate">সর্বমোট বিক্রি</p>
                                        <p className="text-lg sm:text-2xl font-extrabold text-gray-900">{totalRevenue.toLocaleString()} <span className="text-sm sm:text-lg font-medium text-gray-500">৳</span></p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-5">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shadow-inner">
                                        <Clock size={20} className="sm:hidden" />
                                        <Clock size={28} className="hidden sm:block" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-semibold text-gray-500 truncate">পেন্ডিং অর্ডার</p>
                                        <p className="text-lg sm:text-2xl font-extrabold text-gray-900">{pendingCount} <span className="text-sm sm:text-lg font-medium text-gray-500">টি</span></p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Search Bar and Filters */}
                        <div className="mb-6 flex flex-col md:flex-row gap-3 sm:gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="নাম বা মোবাইল নাম্বার দিয়ে খুঁজুন..."
                                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <div className="relative w-full md:w-auto">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Calendar className="text-gray-400" size={18} />
                                </div>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                                    className="w-full md:w-auto pl-11 pr-8 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm cursor-pointer appearance-none bg-white font-semibold text-gray-700"
                                >
                                    <option value="all">সব সময়</option>
                                    <option value="today">আজকের অর্ডার</option>
                                    <option value="week">গত ৭ দিন</option>
                                    <option value="month">গত ৩০ দিন</option>
                                </select>
                            </div>
                        </div>

                        {/* DESKTOP TABLE VIEW */}
                        <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1000px]">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold text-left tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">তারিখ</th>
                                            <th className="px-6 py-4">কাস্টমার</th>
                                            <th className="px-6 py-4">ঠিকানা</th>
                                            <th className="px-6 py-4">অর্ডার ডিটেইলস</th>
                                            <th className="px-6 py-4">মোট ট্রানজেকশন</th>
                                            <th className="px-6 py-4">স্ট্যাটাস লেবেল</th>
                                            <th className="px-6 py-4 text-center">নতুন স্ট্যাটাস</th>
                                            <th className="px-6 py-4 text-center">অ্যাকশন</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedOrders.length === 0 ? (
                                            <tr><td colSpan={8} className="text-center py-16 text-gray-500 font-semibold text-lg">কোনো অর্ডার পাওয়া যায়নি</td></tr>
                                        ) : paginatedOrders.map((order) => {
                                            const { date, time } = formatDate(order.createdAt);
                                            return (
                                                <tr key={order.id} className="hover:bg-orange-50/50 transition duration-150">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-semibold text-gray-900">{date}</div>
                                                        <div className="text-xs text-gray-500 font-medium">{time}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{order.name}</div>
                                                        <div className="text-sm text-gray-600 font-medium font-mono tracking-tight flex items-center gap-1 mt-0.5">
                                                            {order.phone}
                                                            <a href={`https://wa.me/88${order.phone}?text=Hello ${order.name}! Thanks for ordering from ILHAM's Kitchen. We are processing your order for ${order.item} Premium Peyaj Beresta. Your total is ৳${order.total}. Have a great day!`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 ml-1">
                                                                <MessageCircle size={14} />
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-700 max-w-[200px] line-clamp-2 leading-snug" title={order.address}>{order.address}</div>
                                                        <div className="text-xs font-bold text-orange-600 mt-1 uppercase tracking-wide flex items-center gap-2">
                                                            {order.zone === 'Dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}
                                                            <button
                                                                onClick={async () => {
                                                                    await navigator.clipboard.writeText(`${order.name} | ${order.phone} | ${order.address} | Total: ৳${order.total}`);
                                                                    alert('Copied to clipboard!');
                                                                }}
                                                                className="text-gray-400 hover:text-gray-700"
                                                                title="Copy for Pathao/RedX"
                                                            >
                                                                <Copy size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md">
                                                            <Package size={14} className="text-gray-500" />
                                                            <span className="font-bold text-gray-900 text-sm">{order.item}</span>
                                                            <span className="text-gray-500 text-sm font-semibold border-l pl-1 border-gray-300 ml-1">x {order.quantity}</span>
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
                                                            <option value="Confirmed">👍 Confirmed</option>
                                                            <option value="Shipped">🚚 Shipped</option>
                                                            <option value="Delivered">✅ Delivered</option>
                                                            <option value="Cancelled">❌ Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-center border-l border-gray-100">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handlePrintOrder(order)}
                                                                className="text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center transition"
                                                                title="Print Packing Slip"
                                                            >
                                                                <Printer size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteOrder(order.id)}
                                                                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition"
                                                                title="Delete Order"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* MOBILE CARD VIEW */}
                        <div className="lg:hidden space-y-4">
                            {paginatedOrders.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 text-gray-500 font-semibold text-sm">কোনো অর্ডার পাওয়া যায়নি</div>
                            ) : paginatedOrders.map((order) => {
                                const { date, time } = formatDate(order.createdAt);
                                return (
                                    <div key={order.id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none">
                                            <Package size={64} className="-mt-2 -mr-2" />
                                        </div>

                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{order.name}</div>
                                                <div className="text-xs sm:text-sm text-gray-600 font-mono tracking-tight mt-1 flex items-center gap-1">
                                                    <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">{order.phone}</a>
                                                    <a href={`https://wa.me/88${order.phone}?text=Hello ${order.name}! Thanks for ordering from ILHAM's Kitchen. We are processing your order for ${order.item} Premium Peyaj Beresta. Your total is ৳${order.total}. Have a great day!`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 ml-1">
                                                        <MessageCircle size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-xs sm:text-sm font-semibold text-gray-900">{date}</div>
                                                <div className="text-[10px] sm:text-xs text-gray-500 font-medium">{time}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-2.5 sm:p-3 rounded-xl mb-3 text-xs sm:text-sm text-gray-700 leading-snug border border-gray-100">
                                            {order.address}
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <div className="text-[10px] sm:text-xs font-bold text-orange-600 uppercase tracking-wide">{order.zone === 'Dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}</div>
                                                <button
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(`${order.name} | ${order.phone} | ${order.address} | Total: ৳${order.total}`);
                                                        alert('Copied to clipboard!');
                                                    }}
                                                    className="text-gray-400 hover:text-gray-700"
                                                    title="Copy for Pathao/RedX"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mb-4 pb-3 sm:pb-4 border-b border-gray-100">
                                            <div className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200">
                                                <Package size={14} className="text-gray-500" />
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{order.item}</span>
                                                <span className="text-gray-500 text-xs sm:text-sm font-semibold border-l border-gray-300 pl-1.5 ml-0.5">x {order.quantity}</span>
                                            </div>
                                            <div className="font-black text-gray-900 text-lg sm:text-xl">
                                                ৳{order.total}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-center bg-gray-50/50 p-1 sm:p-2 rounded-lg">
                                                <span className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    {order.status === 'Pending' && <Clock size={10} className="mr-1 sm:w-3 sm:h-3" />}
                                                    {order.status === 'Shipped' && <Truck size={10} className="mr-1 sm:w-3 sm:h-3" />}
                                                    {order.status === 'Delivered' && <CheckCircle size={10} className="mr-1 sm:w-3 sm:h-3" />}
                                                    {order.status === 'Cancelled' && <XCircle size={10} className="mr-1 sm:w-3 sm:h-3" />}
                                                    {order.status}
                                                </span>

                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    className="border-2 border-gray-200 pl-2 sm:pl-3 pr-6 sm:pr-8 py-1 sm:py-1.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer text-gray-700 font-semibold shadow-sm text-xs sm:text-sm"
                                                >
                                                    <option value="Pending">🕒 Pending</option>
                                                    <option value="Confirmed">👍 Confirmed</option>
                                                    <option value="Shipped">🚚 Shipped</option>
                                                    <option value="Delivered">✅ Delivered</option>
                                                    <option value="Cancelled">❌ Cancelled</option>
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mt-1 pt-3 border-t border-gray-100">
                                                <button
                                                    onClick={() => handlePrintOrder(order)}
                                                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition border border-blue-100"
                                                >
                                                    <Printer size={14} className="sm:w-4 sm:h-4" /> প্রিন্ট মেমো
                                                </button>
                                                <button
                                                    onClick={() => deleteOrder(order.id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition border border-red-100"
                                                >
                                                    <Trash2 size={14} className="sm:w-4 sm:h-4" /> ডিলিট করুন
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 no-print">
                                <p className="text-gray-500 text-xs sm:text-sm font-medium">দেখাচ্ছে {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} মোট {filteredOrders.length} অর্ডারের মধ্যে</p>
                                <div className="flex gap-2 bg-white border border-gray-200 p-1 rounded-xl shadow-sm w-full sm:w-auto justify-center">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 text-gray-500 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-500 font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-orange-50 rounded-lg transition"
                                    >
                                        <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                                    </button>
                                    <span className="flex items-center px-4 font-bold text-gray-900 border-l border-r border-gray-100 text-sm sm:text-base">পেজ {currentPage}</span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 text-gray-500 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-500 font-semibold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-orange-50 rounded-lg transition"
                                    >
                                        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
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

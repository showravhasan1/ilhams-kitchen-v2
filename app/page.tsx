"use client";

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Truck, Star, Phone, ShoppingCart, Award, ShieldCheck } from 'lucide-react';

const products = [
    { id: '250g', name: '২৫০ গ্রাম', price: 300 },
    { id: '500g', name: '৫০০ গ্রাম', price: 600 },
    { id: '1kg', name: '১ কেজি', price: 1200 },
    { id: '2kg', name: '২ কেজি', price: 2350 },
];

export default function Home() {
    const [selectedProduct, setSelectedProduct] = useState(products[1]);
    const [quantity, setQuantity] = useState(1);
    const [zone, setZone] = useState('Dhaka');
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const deliveryCharge = zone === 'Dhaka' ? 60 : 120;
    const subtotal = selectedProduct.price * quantity;
    const total = subtotal + deliveryCharge;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    item: selectedProduct.id,
                    quantity,
                    zone,
                    subtotal,
                    shipping: deliveryCharge,
                    total
                })
            });

            if (res.ok) {
                setOrderSuccess(true);
                // Fire Facebook Pixel Event here if available
                if (typeof window !== 'undefined' && (window as any).fbq) {
                    (window as any).fbq('track', 'Purchase', { currency: 'BDT', value: total });
                }
            } else {
                alert('কোথাও কোনো সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
            }
        } catch (error) {
            alert('দুঃখিত, আপনার অর্ডারটি গ্রহণ করা সম্ভব হয়নি।');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 bg-orange-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">অর্ডার সফল হয়েছে!</h1>
                    <p className="text-gray-600 mb-6">আপনার অর্ডারটি আমরা পেয়েছি। খুব শীঘ্রই আমাদের একজন প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।</p>
                    <div className="bg-orange-50 p-4 rounded-lg text-left mb-6">
                        <p className="font-semibold text-gray-700">অর্ডার সামারি:</p>
                        <p className="text-gray-600">আইটেম: {selectedProduct.name} x {quantity}</p>
                        <p className="text-gray-600">মোট বিল: {total} টাকা (ক্যাশ অন ডেলিভারি)</p>
                    </div>
                    <button
                        onClick={() => { setOrderSuccess(false); setFormData({ name: '', phone: '', address: '' }); setQuantity(1); }}
                        className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-700 transition"
                    >
                        নতুন অর্ডার করুন
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-xl text-orange-600">IK</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">ILHAM's Kitchen</h1>
                    </div>
                    <a href="#order" className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-700 transition">
                        অর্ডার করুন
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 shadow-inner">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold mb-6 flex items-center gap-2 w-max">
                            <Star size={16} /> সেরা কোয়ালিটির নিশ্চয়তা
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            প্রিমিয়াম ক্রিসপি <span className="text-orange-600">পেয়াজ বেরেস্তা</span> <br /> এখন সুলভ মূল্যে!
                        </h2>
                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                            পেয়াজ বেরেস্তা শুধু স্বাদেই নয়, খাবারের সৌন্দর্যেও এনে দেয় এক অনন্য মাত্রা। বিরিয়ানি, পোলাও, খিচুড়ি বা কোরমার উপর ছিটিয়ে দিন সামান্য দেখবেন, গন্ধ, টেক্সচার আর টেস্ট কয়েক গুণ বেড়ে গেছে!
                        </p>
                        <div className="flex gap-4">
                            <a href="#order" className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 hover:shadow-lg transition flex items-center gap-2">
                                <ShoppingCart size={20} /> অর্ডার করতে ক্লিক করুন
                            </a>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-orange-200 rounded-full absolute -inset-4 blur-3xl opacity-50 animate-pulse"></div>
                        <Image
                            src="/images/WhatsApp Image 2026-02-22 at 02.20.40.jpeg"
                            alt="Premium Peyaj Beresta"
                            width={500}
                            height={500}
                            className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-square border-4 border-white"
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-white px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">কেন আমাদের পেয়াজ বেরেস্তা সেরা?</h3>
                        <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 mb-4 shadow-sm">
                                <ShieldCheck size={28} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">১০০% খাঁটি ও ক্রিসপি</h4>
                            <p className="text-gray-600">আমরা সেরা মানের পেঁয়াজ ও তেল ব্যবহার করি, তাই এটি দীর্ঘসময় মুচমুচে থাকে।</p>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 mb-4 shadow-sm">
                                <CheckCircle2 size={28} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">কোন ঝামেলা নেই</h4>
                            <p className="text-gray-600">রান্নার সময় বাঁচান। প্যাকেট খুলুন আর রেডি টু ইউজ আমাদের বেরেস্তা ব্যবহার করুন।</p>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 mb-4 shadow-sm">
                                <Award size={28} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">ঘরোয়া স্বাদ, রেস্তোরাঁ মান</h4>
                            <p className="text-gray-600">সম্পূর্ণ স্বাস্থ্যকর পরিবেশে ঘড়োয়া উপায়ে তৈরি, কিন্তু রেস্তোরাঁর মত পারফেক্ট স্বাদ।</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery / Social Proof */}
            <section className="py-12 bg-gray-50 px-4">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Image src="/images/WhatsApp Image 2026-02-22 at 02.21.11.jpeg" alt="Product 1" width={300} height={300} className="rounded-xl shadow-md w-full h-48 object-cover" />
                    <Image src="/images/WhatsApp Image 2026-02-22 at 02.21.35.jpeg" alt="Product 2" width={300} height={300} className="rounded-xl shadow-md w-full h-48 object-cover" />
                    <Image src="/images/WhatsApp Image 2026-01-08 at 22.37.44.jpeg" alt="Product 3" width={300} height={300} className="rounded-xl shadow-md w-full h-48 object-cover" />
                    <Image src="/images/h.jpeg" alt="Product 4" width={300} height={300} className="rounded-xl shadow-md w-full h-48 object-cover bg-white" />
                </div>
            </section>

            {/* Checkout Section */}
            <section id="order" className="py-16 px-4 max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">

                    {/* Order Details Left */}
                    <div className="p-8 md:w-1/2 bg-gray-50 border-r border-gray-100">
                        <h3 className="text-2xl font-bold mb-6">অর্ডার সামারি</h3>

                        <div className="space-y-4 mb-8">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">প্যাকেজ নির্বাচন করুন</p>
                            <div className="grid grid-cols-2 gap-3">
                                {products.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSelectedProduct(p)}
                                        className={`p-3 rounded-xl border-2 text-left transition ${selectedProduct.id === p.id ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300 bg-white'}`}
                                    >
                                        <div className="font-bold text-gray-900">{p.name}</div>
                                        <div className="text-orange-600 font-semibold">{p.price}৳</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">পরিমাণ</p>
                            <div className="flex items-center gap-4 bg-white border border-gray-200 w-max rounded-xl overflow-hidden">
                                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 text-xl font-bold text-gray-600">-</button>
                                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                                <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 text-xl font-bold text-gray-600">+</button>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200">
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>সাবটোটাল ({quantity}x {selectedProduct.name})</span>
                                <span className="font-semibold">{subtotal}৳</span>
                            </div>
                            <div className="flex justify-between mb-4 text-gray-600">
                                <span>ডেলিভারি চার্জ ({zone})</span>
                                <span className="font-semibold">{deliveryCharge}৳</span>
                            </div>
                            <div className="border-t border-gray-100 my-3"></div>
                            <div className="flex justify-between text-xl font-bold text-gray-900">
                                <span>সর্বমোট</span>
                                <span className="text-orange-600">{total}৳</span>
                            </div>
                            <p className="text-sm text-center text-green-600 mt-4 font-semibold flex items-center justify-center gap-1">
                                <Truck size={16} /> ক্যাশ অন ডেলিভারি
                            </p>
                        </div>
                    </div>

                    {/* Order Form Right */}
                    <div className="p-8 md:w-1/2">
                        <h3 className="text-2xl font-bold mb-6">ডেলিভারি তথ্য</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">আপনার নাম *</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                    placeholder="সম্পূর্ণ নাম লিখুন"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">মোবাইল নাম্বার *</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">ডেলিভারি এরিয়া *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setZone('Dhaka')}
                                        className={`py-3 px-4 rounded-xl border font-semibold transition ${zone === 'Dhaka' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'}`}
                                    >
                                        ঢাকার ভিতরে (৬০৳)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setZone('Outside')}
                                        className={`py-3 px-4 rounded-xl border font-semibold transition ${zone === 'Outside' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'}`}
                                    >
                                        ঢাকার বাইরে (১২০৳)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">সম্পূর্ণ ঠিকানা *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
                                    placeholder="বাসা নং, রোড নং, এলাকা, থানা, জেলা"
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className={`w-full text-white font-bold text-lg py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 hover:-translate-y-1'}`}
                            >
                                {isSubmitting ? 'প্রসেসিং হচ্ছে...' : `অর্ডার কনফার্ম করুন (${total}৳)`}
                            </button>

                        </form>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="mb-6 md:mb-0">
                        <h4 className="text-2xl font-bold text-orange-500 mb-2">ILHAM's Kitchen</h4>
                        <p className="text-gray-400 max-w-sm">সেরা মানের, স্বাস্থ্যসম্মত ও ১০০% খাঁটি ক্রিসপি পেয়াজ বেরেস্তা।</p>
                    </div>
                    <div>
                        <h5 className="text-lg font-semibold mb-3">যোগাযোগ করুন</h5>
                        <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-2"><Phone size={16} /> 01679226855</p>
                        <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-4">
                            <a href="https://www.facebook.com/profile.php?id=61561058960023" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Facebook Page</a>
                        </p>
                    </div>
                </div>
            </footer>

        </main>
    );
}

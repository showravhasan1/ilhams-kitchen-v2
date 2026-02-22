"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Truck, Star, Phone, ShoppingCart, Award, ShieldCheck, HeartPulse, Clock, MessageCircle, ChevronDown, ChevronUp, Leaf } from 'lucide-react';

const products = [
    { id: '250g', name: '২৫০ গ্রাম', price: 300, popular: false },
    { id: '500g', name: '৫০০ গ্রাম', price: 600, popular: true },
    { id: '1kg', name: '১ কেজি', price: 1200, popular: false },
    { id: '2kg', name: '২ কেজি', price: 2350, popular: false },
];

const faqs = [
    { q: "ডেলিভারি পেতে কতদিন সময় লাগে?", a: "ঢাকার ভিতরে সাধারণত ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ২-৩ দিন সময় লাগে।" },
    { q: "প্রোডাক্টের মান নিয়ে অভিযোগ থাকলে কী করব?", a: "আমাদের শতভাগ রিপ্লেসমেন্ট গ্যারান্টি রয়েছে। সমস্যা হলে ডেলিভারি ম্যান থাকা অবস্থায় আমাদের জানাবেন।" },
    { q: "ক্যাশ অন ডেলিভারি কি সারা বাংলাদেশে পাওয়া যায়?", a: "হ্যাঁ, আমরা সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা প্রদান করছি।" }
];

const reviews = [
    { name: "রাহাত হোসাইন", rating: 5, comment: "অবিশ্বাস্য সুন্দর প্যাকেজিং এবং বেরেস্তার কালার ও ঘ্রাণ একদম পারফেক্ট। পোলাওয়ের স্বাদ অনেক বাড়িয়ে দিয়েছে!" },
    { name: "সাদিয়া ইসলাম", rating: 5, comment: "অনেকগুলো পেজ থেকে কিনেছি, কিন্তু ইলহামস কিচেনের মান আসলেই সেরা। একদম মুচমুচে ছিল।" },
    { name: "মেহেদি হাসান", rating: 4, comment: "ডেলিভারি একটু লেট হয়েছে, কিন্তু প্রোডাক্টের কোয়ালিটি অসাধারণ। আবার অর্ডার করব ইনশাআল্লাহ।" },
];

export default function Home() {
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState(products[1]);
    const [quantity, setQuantity] = useState(1);
    const [zone, setZone] = useState('Dhaka');
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
                const data = await res.json();
                // Fire Facebook Pixel Event here if available
                if (typeof window !== 'undefined' && (window as any).fbq) {
                    (window as any).fbq('track', 'Purchase', { currency: 'BDT', value: total });
                }

                // Redirect to the premium Thank You page
                if (data.success && data.order) {
                    router.push(`/thank-you?id=${data.order.id}`);
                } else {
                    router.push('/thank-you');
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

    const toggleFaq = (index: number) => {
        if (openFaqIndex === index) {
            setOpenFaqIndex(null);
        } else {
            setOpenFaqIndex(index);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 relative">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="ILHAM's Kitchen Logo"
                            width={50}
                            height={50}
                            priority
                            className="object-contain drop-shadow-sm"
                        />
                    </div>
                    <a href="#order" className="hidden md:inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-700 transition">
                        অর্ডার করুন
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            < section className="bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 shadow-inner relative overflow-hidden" >
                {/* Subtle gradient overlay to make text pop */}
                < div className="absolute inset-0 bg-gradient-to-t from-orange-50/50 to-transparent pointer-events-none z-0" ></div >
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
                    <div>
                        <div className="inline-flex bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold mb-6 items-center gap-2 animate-pulse shadow-sm">
                            <Clock size={16} /> সীমিত স্টক – অফারটি দ্রুত শেষ হচ্ছে!
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight drop-shadow-sm">
                            প্রিমিয়াম ক্রিসপি <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">পেয়াজ বেরেস্তা</span> <br /> এখন সুলভ মূল্যে!
                        </h2>
                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                            পেয়াজ বেরেস্তা শুধু স্বাদেই নয়, খাবারের সৌন্দর্যেও এনে দেয় এক অনন্য মাত্রা। বিরিয়ানি, পোলাও, খিচুড়ি বা কোরমার উপর ছিটিয়ে দিন সামান্য দেখবেন, গন্ধ, টেক্সচার আর টেস্ট কয়েক গুণ বেড়ে গেছে!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#order" className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <ShoppingCart size={20} /> এখনই কিনে নিন
                            </a>
                        </div>
                        {/* Trust Badges - Hero */}
                        <div className="mt-8 flex items-center gap-6 text-sm font-semibold text-gray-600">
                            <div className="flex items-center gap-1 bg-white p-2 rounded-lg shadow-sm border border-orange-100"><Truck className="text-orange-500" size={18} /> দ্রুত ডেলিভারি</div>
                            <div className="flex items-center gap-1 bg-white p-2 rounded-lg shadow-sm border border-orange-100"><CheckCircle2 className="text-orange-500" size={18} /> ক্যাশ অন ডেলিভারি</div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-orange-300 rounded-full absolute -inset-4 blur-3xl opacity-40 animate-pulse"></div>
                        <div className="absolute top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl z-20 flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={24} /></div>
                            <div>
                                <div className="font-bold text-gray-900">১০০% খাঁটি</div>
                                <div className="text-xs text-gray-500">প্রাকৃতিক উপাদান</div>
                            </div>
                        </div>
                        <Image
                            src="/images/WhatsApp Image 2026-02-22 at 02.20.40.jpeg"
                            alt="Premium Peyaj Beresta"
                            width={500}
                            height={500}
                            className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-square border-4 border-white"
                        />
                    </div>
                </div>
            </section >

            {/* Features */}
            < section className="py-16 bg-white px-4" >
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">কেন আমাদের পেয়াজ বেরেস্তা সেরা?</h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-b from-orange-50 to-white p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 mb-4 shadow-sm border border-orange-50">
                                <ShieldCheck size={28} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">১০০% খাঁটি ও ক্রিসপি</h4>
                            <p className="text-gray-600">আমরা সেরা মানের পেঁয়াজ ও তেল ব্যবহার করি, তাই এটি দীর্ঘসময় মুচমুচে থাকে।</p>
                        </div>
                        <div className="bg-gradient-to-b from-orange-50 to-white p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 mb-4 shadow-sm border border-orange-50">
                                <HeartPulse size={28} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">কোন ঝামেলা নেই</h4>
                            <p className="text-gray-600">রান্নার সময় বাঁচান। প্যাকেট খুলুন আর রেডি টু ইউজ আমাদের বেরেস্তা ব্যবহার করুন।</p>
                        </div>
                        <div className="bg-gradient-to-b from-orange-50 to-white p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 mb-4 shadow-sm border border-orange-50">
                                <Award size={28} />
                            </div>
                            <h4 className="text-xl font-bold mb-2">ঘরোয়া স্বাদ, রেস্তোরাঁ মান</h4>
                            <p className="text-gray-600">সম্পূর্ণ স্বাস্থ্যকর পরিবেশে ঘড়োয়া উপায়ে তৈরি, কিন্তু রেস্তোরাঁর মত পারফেক্ট স্বাদ।</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* Gallery / Social Proof */}
            < section className="py-12 bg-gray-50 px-4" >
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Image src="/images/WhatsApp Image 2026-02-22 at 02.21.11.jpeg" alt="Product 1" width={300} height={300} className="rounded-xl shadow-md w-full h-48 object-cover hover:scale-105 transition duration-300" />
                    <Image src="/images/WhatsApp Image 2026-02-22 at 02.21.35.jpeg" alt="Product 2" width={300} height={300} className="rounded-xl shadow-md w-full h-48 object-cover hover:scale-105 transition duration-300" />
                    <Image src="/images/WhatsApp Image 2026-01-08 at 22.37.44.jpeg" alt="Product 3" width={300} height={300} className="rounded-xl shadow-md w-full h-48 object-cover hover:scale-105 transition duration-300" />
                    <Image src="/images/h.jpeg" alt="Product 4" width={300} height={300} className="rounded-xl shadow-md w-full h-48 object-cover bg-white hover:scale-105 transition duration-300" />
                </div>
            </section >

            {/* Customer Testimonials */}
            < section className="py-16 bg-white px-4" >
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">আমাদের গ্রাহকরা কী বলছেন?</h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mb-4"></div>
                        <p className="text-gray-600">সারা বাংলাদেশের হাজারো সন্তুষ্ট গ্রাহকের ভালোবাসা</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {reviews.map((review, i) => (
                            <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm relative hover:shadow-md transition">
                                <div className="flex text-orange-400 mb-3">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} size={18} className={idx < review.rating ? "fill-orange-400" : "fill-gray-200 text-gray-200"} />
                                    ))}
                                </div>
                                <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
                                <div className="font-bold text-gray-900">- {review.name}</div>
                                <div className="absolute top-4 right-4 text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Verified
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Checkout Section */}
            < section id="order" className="py-16 px-4 max-w-5xl mx-auto" >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">

                    {/* Order Details Left */}
                    <div className="p-8 lg:w-1/2 bg-gray-50 border-r border-gray-100 relative">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-50 -mr-16 -mt-16 pointer-events-none"></div>

                        <h3 className="text-2xl font-bold mb-6 relative z-10 flex items-center gap-2">
                            <ShoppingCart className="text-orange-600" /> অর্ডার সামারি
                        </h3>

                        <div className="space-y-4 mb-8">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">প্যাকেজ নির্বাচন করুন</p>
                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                {products.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSelectedProduct(p)}
                                        className={`p-4 rounded-xl border-2 text-left transition relative overflow-hidden group ${selectedProduct.id === p.id ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-200 shadow-sm' : 'border-gray-200 hover:border-orange-300 bg-white hover:bg-orange-50/50'}`}
                                    >
                                        {p.popular && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm">জনপ্রিয়</div>}
                                        <div className="font-bold text-gray-900 mt-1 text-lg">{p.name}</div>
                                        <div className="text-orange-600 font-extrabold text-xl tracking-tight">{p.price}৳</div>
                                        {/* Micro Badges in Package */}
                                        <div className="flex gap-1 mt-2">
                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-semibold"><Leaf size={10} /> ন্যাচারাল</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">পরিমাণ</p>
                            <div className="flex items-center gap-4 bg-white border border-gray-200 w-max rounded-xl overflow-hidden shadow-sm relative z-10">
                                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-2 hover:bg-orange-50 text-xl font-bold text-orange-600 transition">-</button>
                                <span className="font-bold text-lg w-8 text-center bg-gray-50 py-1 rounded">{quantity}</span>
                                <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-5 py-2 hover:bg-orange-50 text-xl font-bold text-orange-600 transition">+</button>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md relative z-10">
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>সাবটোটাল ({quantity}x {selectedProduct.name})</span>
                                <span className="font-semibold">{subtotal}৳</span>
                            </div>
                            <div className="flex justify-between mb-4 text-gray-600">
                                <span>ডেলিভারি চার্জ ({zone})</span>
                                <span className="font-semibold">{deliveryCharge}৳</span>
                            </div>
                            <div className="border-t border-dashed border-gray-300 my-3"></div>
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                                <span>সর্বমোট</span>
                                <span className="text-orange-600 text-3xl">{total}৳</span>
                            </div>
                            <div className="bg-green-50 text-green-700 text-sm text-center py-2.5 mt-4 rounded-lg font-semibold flex items-center justify-center gap-2 border border-green-200 shadow-inner">
                                <Truck size={18} /> ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)
                            </div>
                        </div>
                    </div>

                    {/* Order Form Right */}
                    <div className="p-8 lg:w-1/2 relative bg-white">
                        <h3 className="text-2xl font-bold mb-6">ডেলিভারি তথ্য</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">আপনার নাম *</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-gray-50 focus:bg-white shadow-sm"
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
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-gray-50 focus:bg-white shadow-sm"
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">ডেলিভারি এরিয়া *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setZone('Dhaka')}
                                        className={`py-3 px-4 rounded-xl border font-semibold transition ${zone === 'Dhaka' ? 'bg-orange-600 text-white border-orange-600 shadow-md transform scale-[1.02]' : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-orange-400 hover:bg-orange-50'}`}
                                    >
                                        ঢাকার ভিতরে (৬০৳)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setZone('Outside')}
                                        className={`py-3 px-4 rounded-xl border font-semibold transition ${zone === 'Outside' ? 'bg-orange-600 text-white border-orange-600 shadow-md transform scale-[1.02]' : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-orange-400 hover:bg-orange-50'}`}
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
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none bg-gray-50 focus:bg-white shadow-sm"
                                    placeholder="বাসা নং, রোড নং, এলাকা, থানা, জেলা"
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className={`w-full text-white font-bold text-xl py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 hover:-translate-y-1'}`}
                            >
                                <ShoppingCart size={24} /> {isSubmitting ? 'প্রসেসিং হচ্ছে...' : `অর্ডার কনফার্ম করুন (${total}৳)`}
                            </button>
                            <div className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-1 font-semibold">
                                <ShieldCheck size={14} className="text-green-600" /> আপনার তথ্য সম্পূর্ণ নিরাপদ
                            </div>

                        </form>
                    </div>

                </div>
            </section >

            {/* FAQ Section */}
            < section className="py-16 bg-orange-50 px-4 border-t border-orange-100" >
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">সাধারণ জিজ্ঞাসা (FAQ)</h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden group">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full text-left p-5 font-bold text-gray-900 flex justify-between items-center focus:outline-none group-hover:bg-orange-50/30 transition"
                                >
                                    {faq.q}
                                    {openFaqIndex === index ? <ChevronUp className="text-orange-500" /> : <ChevronDown className="text-gray-400" />}
                                </button>
                                {openFaqIndex === index && (
                                    <div className="p-5 pt-0 text-gray-600 border-t border-gray-50 bg-gray-50/50">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-gray-900 text-white pt-12 pb-28 md:pb-12 px-4 shadow-inner relative z-10" >
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                IK
                            </div>
                            <h4 className="text-2xl font-bold text-white tracking-tight">ILHAM's Kitchen</h4>
                        </div>
                        <p className="text-gray-400 max-w-sm">সেরা মানের, স্বাস্থ্যসম্মত ও ১০০% খাঁটি ক্রিসপি পেয়াজ বেরেস্তা।</p>
                    </div>
                    <div>
                        <h5 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2 inline-block">গুরুত্বপূর্ণ লিংক</h5>
                        <ul className="text-gray-400 space-y-2">
                            <li><a href="#order" className="hover:text-orange-400 transition flex items-center gap-2 justify-center md:justify-start"><ShoppingCart size={14} /> অর্ডার করুন</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition">রিফান্ড পলিসি</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition">প্রাইভেসি পলিসি</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2 inline-block">যোগাযোগ</h5>
                        <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-3 bg-gray-800 w-max mx-auto md:mx-0 px-4 py-2 rounded-lg"><Phone size={16} className="text-orange-500" /> 01679226855</p>
                        <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                            <a href="https://www.facebook.com/profile.php?id=61561058960023" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition underline underline-offset-4 decoration-gray-600">Facebook Page</a>
                        </p>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} ILHAM's Kitchen. All rights reserved.
                </div>
            </footer >

            {/* Floating Elements (Mobile CTA & WhatsApp) */}

            {/* Mobile Sticky Order Button */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-3 border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-50">
                <a href="#order" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-extrabold text-lg py-3.5 rounded-xl shadow-xl flex items-center justify-center gap-2 animate-[pulse_2s_ease-in-out_infinite]">
                    <ShoppingCart size={22} /> এখনই অর্ডার করুন
                </a>
            </div>

            {/* WhatsApp/Messenger Bubble (Desktop & Mobile) */}
            <a
                href="https://wa.me/+8801679226855"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-[88px] md:bottom-8 right-4 md:right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-transform duration-300 z-50 flex items-center justify-center border-4 border-white/50"
                aria-label="Contact on WhatsApp"
            >
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
                <MessageCircle size={32} className="relative z-10" />
            </a>

        </main >
    );
}

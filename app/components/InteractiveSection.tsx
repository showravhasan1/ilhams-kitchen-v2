"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CheckCircle2, ShoppingCart, ChevronDown, ChevronUp, Package, MessageCircle
} from 'lucide-react';

/* ─── Bangla Numeral Converter ─── */
const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBangla = (num: number | string): string => {
    return String(num).replace(/[0-9]/g, (d) => banglaDigits[parseInt(d)]);
};

/* ─── FB Cookie Helper ─── */
function getCookie(name: string): string {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
}

/* ─── Data ─── */
const products = [
    { id: '250g', name: '২৫০ গ্রাম', price: 300, originalPrice: 335, perGram: 1.20, save: 0, popular: false, best: false },
    { id: '500g', name: '৫০০ গ্রাম', price: 600, originalPrice: 670, perGram: 1.20, save: 0, popular: false, best: false },
    { id: '700g', name: '৭০০ গ্রাম', price: 950, originalPrice: 1055, perGram: 1.36, save: 0, popular: true, best: false },
    { id: '1kg', name: '১ কেজি', price: 1200, originalPrice: 1335, perGram: 1.20, save: 0, popular: false, best: false },
    { id: '2kg', name: '২ কেজি', price: 2350, originalPrice: 2610, perGram: 1.18, save: 2, popular: false, best: true },
];

const faqs = [
    { q: 'ডেলিভারি পেতে কতদিন সময় লাগে?', a: 'ঢাকায় ২৪ থেকে ৭২ ঘন্টা এবং ঢাকার বাইরে ৩ থেকে ৫ কার্যদিবস সময় লাগে।' },
    { q: 'পেমেন্ট কিভাবে করব?', a: 'সম্পূর্ণ ক্যাশ অন ডেলিভারি। পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে টাকা দিবেন।' },
    { q: 'প্রোডাক্ট পছন্দ না হলে কী করব?', a: 'আমাদের ১০০% রিপ্লেসমেন্ট গ্যারান্টি রয়েছে। ডেলিভারি ম্যান থাকা অবস্থায় সমস্যা জানালে তৎক্ষণাৎ ব্যবস্থা নেওয়া হবে।' },
    { q: 'পণ্যের মেয়াদ কত দিন?', a: 'এয়ারটাইট প্যাকেজিংয়ে ফ্রিজ ছাড়া ৩ মাস এবং ফ্রিজে ৬ মাস পর্যন্ত মচমচে থাকে।' },
];

export default function InteractiveSection() {
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState(products[1]);
    const [quantity, setQuantity] = useState(1);
    const [zone, setZone] = useState('Dhaka');
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const orderRef = useRef<HTMLDivElement>(null);

    const deliveryCharge = zone === 'Dhaka' ? 80 : 150;
    const subtotal = selectedProduct.price * quantity;
    const total = subtotal + deliveryCharge;

    // Send ViewContent + InitiateCheckout events server-side on mount
    useEffect(() => {
        const fbc = getCookie('_fbc');
        const fbp = getCookie('_fbp');
        const url = window.location.href;

        // ViewContent (server-side)
        fetch('/api/fb-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventName: 'ViewContent', sourceUrl: url, fbc, fbp }),
        }).catch(() => { });

        // InitiateCheckout (server-side, since order form is visible)
        fetch('/api/fb-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventName: 'InitiateCheckout', sourceUrl: url, fbc, fbp }),
        }).catch(() => { });

        // Browser-side events (for dedup)
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'ViewContent');
            (window as any).fbq('track', 'InitiateCheckout');
        }
    }, []);

    const scrollToOrder = () => {
        orderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const fbc = getCookie('_fbc');
            const fbp = getCookie('_fbp');

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
                    total,
                    fbc,
                    fbp,
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                // Browser-side Purchase with same eventID for deduplication
                if (typeof window !== 'undefined' && (window as any).fbq) {
                    (window as any).fbq('track', 'Purchase', {
                        currency: 'BDT',
                        value: total,
                    }, { eventID: data.eventId });
                }
                if (data.order) {
                    router.push(`/thank-you?id=${data.order.id}`);
                } else {
                    router.push('/thank-you');
                }
            } else {
                alert(data.error || 'কোথাও একটা সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
            }
        } catch {
            alert('দুঃখিত, আপনার অর্ডারটি গ্রহণ করা সম্ভব হয়নি।');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* ━━━ Checkout Section ━━━ */}
            <section ref={orderRef} id="order" className="py-12 px-4 max-w-5xl mx-auto scroll-mt-16">

                {/* Pricing Cards */}
                <div className="text-center mb-8">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">প্যাকেজ বেছে নিন</h3>
                    <p className="text-gray-500 text-sm">আপনার প্রয়োজন অনুযায়ী সাইজ সিলেক্ট করুন</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {products.map(p => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedProduct(p)}
                            className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-300 group ${selectedProduct.id === p.id
                                ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200 shadow-md scale-[1.02]'
                                : 'border-gray-200 hover:border-orange-300 bg-white hover:bg-orange-50/30 shadow-sm'
                                }`}
                        >
                            {p.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap z-10">
                                    🔥 সবচেয়ে জনপ্রিয়
                                </div>
                            )}
                            {p.best && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap z-10">
                                    💰 বেস্ট ভ্যালু
                                </div>
                            )}
                            {selectedProduct.id === p.id && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                    <CheckCircle2 size={14} className="text-white" />
                                </div>
                            )}
                            <div className="font-black text-gray-900 text-lg mt-1">{p.name}</div>
                            <div className="text-gray-400 text-sm line-through font-bangla">৳{toBangla(p.originalPrice)}</div>
                            <div className="text-orange-600 font-black text-2xl font-bangla">৳{toBangla(p.price)}</div>
                            <div className="mt-1 inline-block text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                                ১০% ছাড়
                            </div>
                            {p.save > 0 && (
                                <div className="mt-2 inline-block text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                    {toBangla(p.save)}% সেভ
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm max-w-sm mx-auto">
                    <span className="text-sm font-bold text-gray-700">{selectedProduct.name} এর পরিমাণ</span>
                    <div className="flex items-center gap-0 border border-gray-300 rounded-xl overflow-hidden">
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2.5 hover:bg-orange-50 text-lg font-bold text-orange-600 transition">−</button>
                        <span className="font-bold text-lg w-10 text-center bg-gray-50 py-2.5">{quantity}</span>
                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-4 py-2.5 hover:bg-orange-50 text-lg font-bold text-orange-600 transition">+</button>
                    </div>
                </div>

                {/* Main Checkout Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-2xl mx-auto">
                    <div className="p-6 sm:p-8">
                        <h3 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                            <Package className="text-orange-600" size={22} /> অর্ডার করুন
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">আপনার নাম *</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-gray-50 focus:bg-white shadow-sm text-base"
                                    placeholder="আপনার সম্পূর্ণ নাম"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">মোবাইল নম্বর *</label>
                                <input
                                    required
                                    type="tel"
                                    pattern="01[3-9][0-9]{8}"
                                    minLength={11}
                                    maxLength={11}
                                    title="সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 11) })}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-gray-50 focus:bg-white shadow-sm text-base"
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">ডেলিভারি এরিয়া *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setZone('Dhaka')}
                                        className={`py-3.5 px-4 rounded-xl border-2 font-bold text-sm transition-all ${zone === 'Dhaka'
                                            ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]'
                                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                                            }`}
                                    >
                                        ঢাকা সিটি
                                        <div className="text-[10px] font-medium mt-0.5 opacity-80">ডেলিভারি ৳৮০</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setZone('Outside')}
                                        className={`py-3.5 px-4 rounded-xl border-2 font-bold text-sm transition-all ${zone === 'Outside'
                                            ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]'
                                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                                            }`}
                                    >
                                        ঢাকার বাইরে
                                        <div className="text-[10px] font-medium mt-0.5 opacity-80">ডেলিভারি ৳১৫০</div>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">সম্পূর্ণ ঠিকানা *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none bg-gray-50 focus:bg-white shadow-sm text-base"
                                    placeholder="বাসা নং, রোড নং, এলাকা, থানা, জেলা"
                                />
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>সাবটোটাল ({toBangla(quantity)}x {selectedProduct.name})</span>
                                    <span className="font-bold font-bangla">৳{toBangla(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>ডেলিভারি চার্জ ({zone === 'Dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'})</span>
                                    <span className="font-bold font-bangla">৳{toBangla(deliveryCharge)}</span>
                                </div>
                                <div className="border-t border-dashed border-gray-300 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-gray-900">মোট বিল</span>
                                    <span className="font-black text-2xl text-orange-600 font-bangla">৳{toBangla(total)}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className={`w-full text-white font-black text-lg py-4.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98]'
                                    }`}
                            >
                                <ShoppingCart size={22} />
                                {isSubmitting ? 'প্রসেসিং হচ্ছে...' : <span>অর্ডার কনফার্ম করুন (<span className="font-bangla">৳{toBangla(total)}</span>)</span>}
                            </button>

                            {/* Trust Assurance */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                                <p className="text-green-700 text-sm font-bold flex items-center justify-center gap-2">
                                    <CheckCircle2 size={16} /> পণ্য হাতে পেয়ে টাকা দিন
                                </p>
                                <p className="text-green-600 text-xs mt-1">পছন্দ না হলে ফেরত নিন। ১০০% মানি ব্যাক গ্যারান্টি</p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* ━━━ FAQ ━━━ */}
            <section className="py-14 bg-orange-50/50 px-4 border-t border-orange-100">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">সাধারণ জিজ্ঞাসা</h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    className="w-full text-left p-5 font-bold text-gray-900 flex justify-between items-center focus:outline-none hover:bg-orange-50/30 transition text-sm sm:text-base"
                                >
                                    {faq.q}
                                    {openFaqIndex === index ? <ChevronUp className="text-orange-500 shrink-0" size={20} /> : <ChevronDown className="text-gray-400 shrink-0" size={20} />}
                                </button>
                                {openFaqIndex === index && (
                                    <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mobile Sticky Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-3 border-t border-gray-200 shadow-[0_-8px_20px_-4px_rgba(0,0,0,0.1)] z-50">
                <div className="flex items-center gap-3">
                    <div className="shrink-0">
                        <div className="text-[10px] text-gray-500 font-medium">মোট বিল</div>
                        <div className="text-lg font-black text-orange-600 font-bangla">৳{toBangla(total)}</div>
                    </div>
                    <button onClick={scrollToOrder} className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-base py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition">
                        <ShoppingCart size={18} /> এখনই অর্ডার করুন
                    </button>
                </div>
            </div>

            {/* WhatsApp Bubble */}
            <a
                href="https://wa.me/+8801679226855"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-[80px] md:bottom-8 right-4 md:right-8 bg-green-500 text-white p-3.5 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-transform duration-300 z-50 flex items-center justify-center border-4 border-white/50"
                aria-label="Contact on WhatsApp"
            >
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
                <MessageCircle size={28} className="relative z-10" />
            </a>
        </>
    );
}

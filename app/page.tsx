"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    CheckCircle2, Truck, Star, Phone, ShoppingCart, Award, ShieldCheck,
    HeartPulse, Clock, MessageCircle, ChevronDown, ChevronUp, Leaf,
    Flame, Users, Timer, Sparkles, UtensilsCrossed, Copy, Package, Heart
} from 'lucide-react';

/* ─── Bangla Numeral Converter ─── */
const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBangla = (num: number | string): string => {
    return String(num).replace(/[0-9]/g, (d) => banglaDigits[parseInt(d)]);
};

/* ─── Data ─── */
const products = [
    { id: '250g', name: '২৫০ গ্রাম', price: 300, originalPrice: 335, perGram: 1.20, save: 0, popular: false, best: false },
    { id: '500g', name: '৫০০ গ্রাম', price: 600, originalPrice: 670, perGram: 1.20, save: 0, popular: false, best: false },
    { id: '700g', name: '৭০০ গ্রাম', price: 950, originalPrice: 1055, perGram: 1.36, save: 0, popular: true, best: false },
    { id: '1kg', name: '১ কেজি', price: 1200, originalPrice: 1335, perGram: 1.20, save: 0, popular: false, best: false },
    { id: '2kg', name: '২ কেজি', price: 2350, originalPrice: 2610, perGram: 1.18, save: 2, popular: false, best: true },
];

const features = [
    { icon: Timer, title: 'সময় বাঁচান', desc: 'ঘণ্টার পর ঘণ্টা পেঁয়াজ কাটা ও ভাজার ঝামেলা নেই' },
    { icon: Sparkles, title: 'মচমচে গ্যারান্টি', desc: 'প্রতিটি বেরেস্তা সমানভাবে গোল্ডেন ব্রাউন করা' },
    { icon: Leaf, title: 'কেমিক্যাল ফ্রি', desc: 'কোনো প্রিজার্ভেটিভ বা আর্টিফিশিয়াল কালার নেই' },
    { icon: ShieldCheck, title: 'দীর্ঘ মেয়াদ', desc: 'সঠিকভাবে সংরক্ষণ করলে ৬ থেকে ৮ মাস ফ্রেশ' },
    { icon: UtensilsCrossed, title: 'ভার্সেটাইল ব্যবহার', desc: 'বিরিয়ানি, তেহারি, পোলাও, হালিম, এমনকি সালাদেও' },
    { icon: Heart, title: 'ঘরোয়া স্বাদ', desc: 'সম্পূর্ণ ঘরোয়া পরিবেশে হাতে তৈরি, ভালোবাসা দিয়ে রান্না' },
];

const usages = [
    { name: 'বিরিয়ানি', emoji: '🍚' },
    { name: 'তেহারি', emoji: '🍛' },
    { name: 'পোলাও', emoji: '🥘' },
    { name: 'খিচুড়ি', emoji: '🍲' },
    { name: 'হালিম', emoji: '🫕' },
    { name: 'সালাদ টপিং', emoji: '🥗' },
];

const reviews = [
    { name: 'রিমা আক্তার', location: 'ধানমন্ডি, ঢাকা', rating: 5, comment: 'গত ঈদে বিরিয়ানির জন্য অর্ডার করেছিলাম। অসাধারণ মচমচে! এখন প্রতি মাসে অর্ডার দিই। বাসায় বানানোর চেয়ে অনেক ভালো।' },
    { name: 'করিম ভাই', location: 'রাজশাহী', rating: 5, comment: 'ঢাকার বাইরে থেকেও ৪ দিনে পেয়ে গেছি। প্যাকেজিং খুব সুন্দর ছিল, একটুও ভাঙেনি।' },
    { name: 'সাদিয়া ইসলাম', location: 'উত্তরা, ঢাকা', rating: 5, comment: 'অনেকগুলো পেজ থেকে কিনেছি, কিন্তু ইলহামস কিচেনের মান আসলেই সেরা। একদম মচমচে ছিল।' },
    { name: 'ফাতেমা বেগম', location: 'মিরপুর, ঢাকা', rating: 5, comment: 'অসাধারণ স্বাদ! বাজারের বেরেস্তার সাথে তুলনাই হয় না। পরিবারের সবাই খুব পছন্দ করেছে।' },
    { name: 'রাশেদ আহমেদ', location: 'চট্টগ্রাম', rating: 4, comment: 'রান্নার সময় এত বাঁচে যে এখন বেরেস্তা ছাড়া রান্নাই হয় না। দারুণ প্রোডাক্ট, দারুণ সার্ভিস।' },
];

const faqs = [
    { q: 'ডেলিভারি পেতে কতদিন সময় লাগে?', a: 'ঢাকায় ২৪ থেকে ৭২ ঘন্টা এবং ঢাকার বাইরে ৩ থেকে ৫ কার্যদিবস সময় লাগে।' },
    { q: 'পেমেন্ট কিভাবে করব?', a: 'সম্পূর্ণ ক্যাশ অন ডেলিভারি। পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে টাকা দিবেন।' },
    { q: 'প্রোডাক্ট পছন্দ না হলে কী করব?', a: 'আমাদের ১০০% রিপ্লেসমেন্ট গ্যারান্টি রয়েছে। ডেলিভারি ম্যান থাকা অবস্থায় সমস্যা জানালে তৎক্ষণাৎ ব্যবস্থা নেওয়া হবে।' },
    { q: 'পণ্যের মেয়াদ কত দিন?', a: 'এয়ারটাইট প্যাকেজিংয়ে ফ্রিজ ছাড়া ৩ মাস এবং ফ্রিজে ৬ মাস পর্যন্ত মচমচে থাকে।' },
];

/* ─── Component ─── */
export default function Home() {
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState(products[1]);
    const [quantity, setQuantity] = useState(1);
    const [zone, setZone] = useState('Dhaka');
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
    const orderRef = useRef<HTMLDivElement>(null);

    const deliveryCharge = zone === 'Dhaka' ? 80 : 150;
    const subtotal = selectedProduct.price * quantity;
    const total = subtotal + deliveryCharge;

    /* Scroll-triggered fade-in observer */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => new Set(prev).add(entry.target.id));
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const isVisible = (id: string) => visibleSections.has(id);

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
            const data = await res.json();
            if (res.ok && data.success) {
                if (typeof window !== 'undefined' && (window as any).fbq) {
                    (window as any).fbq('track', 'Purchase', { currency: 'BDT', value: total });
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

    const scrollToOrder = () => {
        orderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <main className="min-h-screen bg-gray-50 relative">

            {/* ━━━ Social Proof Ticker ━━━ */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-2.5 px-4 text-center text-sm font-semibold overflow-hidden">
                <div className="flex items-center justify-center gap-3 sm:gap-6 animate-fade-in">
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-orange-400" /> ৫০০+ সন্তুষ্ট কাস্টমার</span>
                    <span className="text-orange-400">★</span>
                    <span className="flex items-center gap-1">৪.৯ গড় রেটিং</span>
                    <span className="text-orange-400 hidden sm:inline">★</span>
                    <span className="hidden sm:flex items-center gap-1"><Truck size={14} className="text-orange-400" /> সারা বাংলাদেশে ডেলিভারি</span>
                </div>
            </div>

            {/* ━━━ Header ━━━ */}
            <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 py-2.5 flex justify-center md:justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <Image
                            src="/brand-logo.webp"
                            alt="ILHAM's Kitchen Logo"
                            width={44}
                            height={44}
                            priority
                            className="object-contain rounded-full shadow-sm border-2 border-orange-100"
                        />
                        <div>
                            <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none">ILHAM&apos;s Kitchen</h1>
                            <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-widest">হোমমেইড পেঁয়াজ বেরেস্তা</p>
                        </div>
                    </div>
                    <button onClick={scrollToOrder} className="hidden md:inline-flex bg-gradient-to-r from-orange-600 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:from-orange-700 hover:to-orange-600 transition-all shadow-md items-center gap-2">
                        <ShoppingCart size={16} /> অর্ডার করুন
                    </button>
                </div>
            </header>

            {/* ━━━ Hero Section ━━━ */}
            <section className="relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero.webp"
                        alt="Premium Peyaj Beresta"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                        quality={60}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
                    {/* Logo Watermark */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/brand-logo.webp"
                            alt="ILHAM's Kitchen"
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-white/30 shadow-2xl object-contain bg-white/90 p-1"
                        />
                    </div>

                    <div className="inline-flex bg-red-500/90 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-5 items-center gap-2 backdrop-blur-sm shadow-lg">
                        <Flame size={16} className="animate-pulse" /> সব প্যাকেজে ১০% ছাড়!
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight drop-shadow-lg">
                        বাড়িতে তৈরি খাঁটি<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">পেঁয়াজ বেরেস্তা</span>
                    </h2>

                    <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl mx-auto leading-relaxed">
                        শতভাগ কেমিক্যাল মুক্ত, সম্পূর্ণ হাতে তৈরি মচমচে পেঁয়াজ বেরেস্তা। আপনার রান্নাকে দিন রেস্তোরাঁর স্বাদ।
                    </p>

                    <button
                        onClick={scrollToOrder}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:-translate-y-1 hover:shadow-orange-500/30 hover:shadow-3xl flex items-center justify-center gap-3 mx-auto animate-pulse-soft"
                    >
                        <ShoppingCart size={22} /> এখনই অর্ডার করুন
                    </button>

                    <p className="text-gray-300 text-sm mt-4 font-medium">
                        ক্যাশ অন ডেলিভারি ✦ ঢাকায় ২৪ ঘন্টায় ডেলিভারি
                    </p>
                </div>
            </section>

            {/* ━━━ Trust Badges ━━━ */}
            <section className="bg-white py-6 px-4 border-b border-gray-100">
                <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { icon: CheckCircle2, text: 'ক্যাশ অন ডেলিভারি', sub: 'পণ্য হাতে পেয়ে টাকা দিন', color: 'text-green-600', bg: 'bg-green-50' },
                        { icon: Truck, text: 'দ্রুত ডেলিভারি', sub: 'ঢাকায় ২৪ থেকে ৭২ ঘন্টা', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { icon: Leaf, text: '১০০% অর্গানিক', sub: 'কেমিক্যাল ফ্রি', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { icon: ShieldCheck, text: 'ফেরত গ্যারান্টি', sub: 'পছন্দ না হলে ফেরত নিন', color: 'text-orange-600', bg: 'bg-orange-50' },
                    ].map((badge, i) => (
                        <div key={i} className={`${badge.bg} p-3 sm:p-4 rounded-2xl text-center border border-gray-100`}>
                            <badge.icon size={24} className={`${badge.color} mx-auto mb-2`} />
                            <div className="font-bold text-gray-900 text-xs sm:text-sm">{badge.text}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{badge.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ━━━ Why Our Beresta? ━━━ */}
            <section id="sec-features" data-animate className={`py-14 bg-gradient-to-b from-orange-50/50 to-white px-4 transition-all duration-700 ${isVisible('sec-features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">কেন আমাদের বেরেস্তা?</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">ILHAM&apos;s Kitchen এর বেরেস্তা সম্পূর্ণ হাতে তৈরি ও এয়ারটাইট প্যাকেজিংয়ে আসে</p>
                        <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mt-4"></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <f.icon size={24} className="text-orange-600" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h4>
                                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ Product Gallery ━━━ */}
            <section id="sec-gallery" data-animate className={`py-10 bg-white px-4 transition-all duration-700 ${isVisible('sec-gallery') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">আমাদের প্রোডাক্ট</h3>
                        <p className="text-gray-500 text-sm">এয়ারটাইট প্যাকেজিংয়ে আসে যাতে মচমচে ভাব দীর্ঘদিন থাকে</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="relative">
                            <Image src="/images/WhatsApp Image 2026-02-22 at 02.20.40.webp" alt="প্রিমিয়াম পেয়াজ বেরেস্তা" width={300} height={300} loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" quality={65} className="rounded-2xl shadow-md w-full h-40 sm:h-48 object-cover hover:scale-[1.03] transition duration-300 border border-orange-100" />
                            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 z-10">
                                <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-green-600" /></div>
                                <div className="leading-none">
                                    <div className="font-black text-gray-900 text-[11px]">১০০% খাঁটি</div>
                                    <div className="text-[8px] text-gray-500 font-medium">প্রাকৃতিক উপাদান</div>
                                </div>
                            </div>
                        </div>
                        <Image src="/images/WhatsApp Image 2026-02-22 at 02.21.11.webp" alt="গোল্ডেন ফ্রাইড বেরেস্তা" width={300} height={300} loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" quality={65} className="rounded-2xl shadow-md w-full h-40 sm:h-48 object-cover hover:scale-[1.03] transition duration-300 border border-orange-100" />
                        <Image src="/images/WhatsApp Image 2026-02-22 at 02.21.35.webp" alt="ক্রিসপি বেরেস্তা ক্লোজআপ" width={300} height={300} loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" quality={65} className="rounded-2xl shadow-md w-full h-40 sm:h-48 object-cover hover:scale-[1.03] transition duration-300 border border-orange-100" />
                        <Image src="/images/h.webp" alt="প্যাকেজড বেরেস্তা" width={300} height={300} loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" quality={65} className="rounded-2xl shadow-md w-full h-40 sm:h-48 object-cover bg-white hover:scale-[1.03] transition duration-300 border border-orange-100" />
                    </div>
                </div>
            </section>

            {/* ━━━ Usage Section ━━━ */}
            <section id="sec-usage" data-animate className={`py-12 bg-gradient-to-b from-orange-50 to-white px-4 transition-all duration-700 ${isVisible('sec-usage') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="max-w-5xl mx-auto text-center">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">কোথায় ব্যবহার করবেন?</h3>
                    <p className="text-gray-500 text-sm mb-8">যেকোনো ভারী রান্নায় সরাসরি ছিটিয়ে দিন</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {usages.map((u, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-orange-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                <div className="text-3xl mb-2">{u.emoji}</div>
                                <div className="font-bold text-gray-800 text-xs sm:text-sm">{u.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ Customer Reviews ━━━ */}
            <section id="sec-reviews" data-animate className={`py-14 bg-white px-4 transition-all duration-700 ${isVisible('sec-reviews') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">কাস্টমারদের মতামত</h3>
                        <p className="text-gray-500 text-sm">সারা বাংলাদেশের সন্তুষ্ট কাস্টমারদের অভিজ্ঞতা</p>
                        <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mt-4"></div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reviews.map((review, i) => (
                            <div key={i} className="bg-gradient-to-b from-orange-50/50 to-white p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300 relative">
                                <div className="flex text-orange-400 mb-3 gap-0.5">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} size={16} className={idx < review.rating ? 'fill-orange-400' : 'fill-gray-200 text-gray-200'} />
                                    ))}
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{review.comment}&rdquo;</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{review.name}</div>
                                        <div className="text-xs text-gray-500">{review.location}</div>
                                    </div>
                                    <div className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Verified
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ Social Proof Counter ━━━ */}
            <section className="py-4 px-4">
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 text-center shadow-sm">
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold text-sm sm:text-base">
                        <Flame size={18} className="text-orange-500" />
                        এই সপ্তাহে <span className="text-green-800 text-lg sm:text-xl font-black">২০০+</span> অর্ডার কমপ্লিট হয়েছে!
                    </div>
                    <p className="text-green-600 text-xs mt-1">আজই অর্ডার করুন, আগামীকাল ডেলিভারি পাবেন</p>
                </div>
            </section>

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
                            {/* Badges */}
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

                            {/* Selected Checkmark */}
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

                            {/* Savings Badge */}
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

                    {/* Order Form */}
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
            <section id="sec-faq" data-animate className={`py-14 bg-orange-50/50 px-4 border-t border-orange-100 transition-all duration-700 ${isVisible('sec-faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

            {/* ━━━ Footer ━━━ */}
            <footer className="bg-gray-900 text-white pt-12 pb-28 md:pb-12 px-4 relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <Image
                                src="/brand-logo.webp"
                                alt="ILHAM's Kitchen"
                                width={40}
                                height={40}
                                className="rounded-full border-2 border-orange-500/30 object-contain bg-white p-0.5"
                            />
                            <h4 className="text-xl font-black text-white tracking-tight">ILHAM&apos;s Kitchen</h4>
                        </div>
                        <p className="text-gray-400 max-w-sm text-sm">সেরা মানের, স্বাস্থ্যসম্মত ও ১০০% খাঁটি ক্রিসপি পেয়াজ বেরেস্তা।</p>
                    </div>
                    <div>
                        <h5 className="text-sm font-bold mb-3 text-gray-300 uppercase tracking-wider">যোগাযোগ</h5>
                        <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-2 bg-gray-800 w-max mx-auto md:mx-0 px-4 py-2 rounded-lg">
                            <Phone size={14} className="text-orange-500" /> 01679226855
                        </p>
                        <a href="https://www.facebook.com/profile.php?id=61561058960023" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition text-sm underline underline-offset-4 decoration-gray-700">
                            Facebook Page
                        </a>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-xs">
                    &copy; {new Date().getFullYear()} ILHAM&apos;s Kitchen. All rights reserved.
                </div>
            </footer>

            {/* ━━━ Floating Elements ━━━ */}

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

        </main>
    );
}

import Image from 'next/image';
import {
    CheckCircle2, Truck, Star, Phone, ShoppingCart, Award, ShieldCheck,
    HeartPulse, Leaf, Flame, Users, Timer, Sparkles, UtensilsCrossed, Heart
} from 'lucide-react';
import LazyInteractive from './components/LazyInteractive';

/* ─── Bangla Numeral Converter ─── */
const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBangla = (num: number | string): string => {
    return String(num).replace(/[0-9]/g, (d) => banglaDigits[parseInt(d)]);
};

/* ─── Static Data ─── */
const features = [
    { icon: Timer, title: 'সময় বাঁচান', desc: 'ঘণ্টার পর ঘণ্টা পেঁয়াজ কাটা ও ভাজার ঝামেলা নেই' },
    { icon: Sparkles, title: 'মচমচে গ্যারান্টি', desc: 'প্রতিটি বেরেস্তা সমানভাবে গোল্ডেন ব্রাউন করা' },
    { icon: Leaf, title: 'কেমিক্যাল ফ্রি', desc: 'কোনো প্রিজার্ভেটিভ বা আর্টিফিশিয়াল কালার নেই' },
    { icon: HeartPulse, title: 'স্বাস্থ্যসম্মত', desc: 'বিশুদ্ধ সয়াবিন তেলে ভাজা, কোনো পাম অয়েল নয়' },
    { icon: Award, title: 'প্রিমিয়াম মান', desc: 'এয়ারটাইট প্যাকেজিংয়ে আসে সতেজতা বজায় রাখতে' },
    { icon: UtensilsCrossed, title: 'ঘরোয়া স্বাদ', desc: 'সম্পূর্ণ হাতে তৈরি, বাড়ির রান্নার মতো স্বাদ' },
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

/* ─── Server Component ─── */
export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 relative">

            {/* ━━━ Social Proof Ticker ━━━ */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-2.5 px-4 text-center text-sm font-semibold overflow-hidden">
                <div className="flex items-center justify-center gap-3 sm:gap-6">
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
                    <a href="#order" className="hidden md:inline-flex bg-gradient-to-r from-orange-600 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:from-orange-700 hover:to-orange-600 transition-all shadow-md items-center gap-2">
                        <ShoppingCart size={16} /> অর্ডার করুন
                    </a>
                </div>
            </header>

            {/* ━━━ Hero Section ━━━ */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/hero.webp"
                        alt="Premium Peyaj Beresta"
                        fetchPriority="high"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
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
                        <Flame size={16} /> সব প্যাকেজে ১০% ছাড়!
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight drop-shadow-lg">
                        বাড়িতে তৈরি খাঁটি<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">পেঁয়াজ বেরেস্তা</span>
                    </h2>

                    <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl mx-auto leading-relaxed">
                        শতভাগ কেমিক্যাল মুক্ত, সম্পূর্ণ হাতে তৈরি মচমচে পেঁয়াজ বেরেস্তা। আপনার রান্নাকে দিন রেস্তোরাঁর স্বাদ।
                    </p>

                    <a
                        href="#order"
                        className="inline-flex bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:-translate-y-1 hover:shadow-orange-500/30 hover:shadow-3xl items-center justify-center gap-3 animate-pulse-soft"
                    >
                        <ShoppingCart size={22} /> এখনই অর্ডার করুন
                    </a>

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
                        { icon: ShieldCheck, text: '১০০% অর্গানিক', sub: 'কেমিক্যাল ফ্রি', color: 'text-purple-600', bg: 'bg-purple-50' },
                        { icon: Heart, text: 'ফেরত গ্যারান্টি', sub: 'পছন্দ না হলে ফেরত', color: 'text-red-600', bg: 'bg-red-50' },
                    ].map((badge, i) => (
                        <div key={i} className={`${badge.bg} p-3.5 rounded-2xl text-center border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
                            <badge.icon className={`mx-auto mb-2 ${badge.color}`} size={22} />
                            <div className="font-bold text-gray-900 text-xs sm:text-sm">{badge.text}</div>
                            <div className="text-gray-500 text-[10px] mt-0.5">{badge.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ━━━ Why Our Beresta? ━━━ */}
            <section className="py-14 bg-gradient-to-b from-orange-50/50 to-white px-4">
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
            <section className="py-10 bg-white px-4">
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
            <section className="py-12 bg-gradient-to-b from-orange-50 to-white px-4">
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
            <section className="py-14 bg-white px-4">
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

            {/* ━━━ Interactive Section (Client Component) ━━━ */}
            <LazyInteractive />

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

        </main>
    );
}

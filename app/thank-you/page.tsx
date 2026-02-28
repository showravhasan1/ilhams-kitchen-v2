import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { CheckCircle2, ChevronRight, MessageCircle, Package, Truck, ShieldCheck, Phone } from 'lucide-react';

/* ─── Bangla Numeral Converter ─── */
const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBangla = (num: number | string): string => {
    return String(num).replace(/[0-9]/g, (d) => banglaDigits[parseInt(d)]);
};

async function ThankYouContent({ searchParams }: { searchParams: { id?: string } }) {
    const orderId = searchParams?.id;
    let order = null;

    if (orderId) {
        order = await prisma.order.findUnique({
            where: { id: orderId }
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center py-10 px-4">

            {/* Header */}
            <div className="mb-8 flex flex-col items-center gap-3">
                <Image
                    src="/brand-logo.jpeg"
                    alt="ILHAM's Kitchen"
                    width={56}
                    height={56}
                    priority
                    className="rounded-full border-2 border-orange-100 shadow-md object-contain"
                />
                <div className="text-center">
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">ILHAM&apos;s Kitchen</h1>
                    <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-widest">হোমমেইড পেঁয়াজ বেরেস্তা</p>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Success Header */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full blur-2xl -ml-14 -mb-14 pointer-events-none"></div>

                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg relative z-10">
                        <CheckCircle2 size={44} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black mb-2 relative z-10">অর্ডার সফল হয়েছে! 🎉</h2>
                    <p className="text-green-50 font-medium text-sm relative z-10 max-w-sm mx-auto leading-relaxed">
                        {order ? `${order.name}, আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।` : 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।'} খুব শীঘ্রই আমরা কল করে কনফার্ম করব।
                    </p>
                </div>

                {/* Details */}
                <div className="p-6 sm:p-8">

                    {order && (
                        <div className="bg-gradient-to-b from-orange-50/50 to-white rounded-2xl p-5 mb-6 border border-orange-100">
                            <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Package size={14} /> অর্ডার সামারি
                            </h3>

                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                    <span className="text-gray-500 text-sm">অর্ডার আইডি</span>
                                    <span className="font-bold text-gray-900 text-sm font-mono bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-lg border border-orange-100">#{order.id.slice(-6).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                    <span className="text-gray-500 text-sm">আইটেম</span>
                                    <span className="font-bold text-gray-900 text-sm">{order.item} <span className="text-gray-400 font-normal">x</span> {toBangla(order.quantity)}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                    <span className="text-gray-500 text-sm">ডেলিভারি</span>
                                    <span className="font-bold text-gray-900 text-sm">{order.zone === 'Dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                    <span className="text-gray-500 text-sm">পেমেন্ট</span>
                                    <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wide bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">ক্যাশ অন ডেলিভারি</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-dashed border-orange-200 flex justify-between items-center">
                                <span className="font-black text-gray-900">মোট বিল</span>
                                <span className="font-black text-2xl text-orange-600 font-bangla">৳{toBangla(order.total)}</span>
                            </div>
                        </div>
                    )}

                    {/* Info Cards */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-center">
                            <Truck size={22} className="mx-auto mb-2 text-blue-500" />
                            <h4 className="font-bold text-gray-900 text-xs mb-1">দ্রুত ডেলিভারি</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed">ঢাকায় ২৪ থেকে ৭২ ঘন্টা, বাইরে ৩ থেকে ৫ দিন</p>
                        </div>
                        <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 text-center">
                            <ShieldCheck size={22} className="mx-auto mb-2 text-green-500" />
                            <h4 className="font-bold text-gray-900 text-xs mb-1">ফ্রেশ গ্যারান্টি</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed">১০০% মচমচে ও কেমিক্যাল মুক্ত</p>
                        </div>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                        href={`https://wa.me/8801679226855?text=${encodeURIComponent(`আসসালামু আলাইকুম, ILHAM's Kitchen! ${order ? `আমার অর্ডার আইডি #${order.id.slice(-6).toUpperCase()}। ` : ''}আমি একটি অর্ডার করেছি। ডেলিভারি স্ট্যাটাস জানতে চাই।`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg mb-4 active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2.5 rounded-xl">
                                <MessageCircle size={22} />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold">WhatsApp এ যোগাযোগ করুন</div>
                                <div className="text-[10px] text-green-100 font-medium flex items-center gap-1">
                                    <Phone size={10} /> 01679226855
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* Call CTA */}
                    <a
                        href="tel:+8801679226855"
                        className="block w-full text-center py-3.5 text-sm font-bold text-orange-600 hover:text-orange-700 transition bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-200 mb-3"
                    >
                        📞 কল করুন: 01679226855
                    </a>

                    <Link
                        href="/"
                        className="block w-full text-center py-3.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition bg-gray-50 hover:bg-gray-100 rounded-2xl"
                    >
                        ← হোম পেজে ফিরে যান
                    </Link>
                </div>
            </div>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-400 mt-8 max-w-sm">
                অর্ডার সংক্রান্ত যেকোনো জিজ্ঞাসায় আমাদের WhatsApp বা কলে যোগাযোগ করুন।
            </p>
        </div>
    );
}

export default function ThankYouPage({ searchParams }: { searchParams: { id?: string } }) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div></div>}>
            <ThankYouContent searchParams={searchParams} />
        </Suspense>
    );
}

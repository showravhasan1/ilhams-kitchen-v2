import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { CheckCircle2, ChevronRight, MessageCircle, Package, Truck, ShieldCheck, MapPin } from 'lucide-react';

async function ThankYouContent({ searchParams }: { searchParams: { id?: string } }) {
    const orderId = searchParams?.id;
    let order = null;

    if (orderId) {
        order = await prisma.order.findUnique({
            where: { id: orderId }
        });
    }
    return (
        <div className="min-h-screen bg-orange-50/50 flex flex-col items-center py-12 px-4 selection:bg-orange-200">
            {/* Header / Logo */}
            <div className="mb-8 flex items-center gap-3">
                <Image src="/logo.png" alt="ILHAM's Kitchen Logo" width={50} height={50} priority className="object-contain drop-shadow-sm" />
                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">ILHAM's Kitchen</h1>
            </div>

            {/* Main Card */}
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl overflow-hidden border border-orange-100">
                {/* Success Header Area */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-12 -mb-12 pointer-events-none"></div>

                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg relative z-10">
                        <CheckCircle2 size={44} className="text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black mb-2 relative z-10">অর্ডার সফল হয়েছে!</h2>
                    <p className="text-green-50 font-medium text-sm md:text-base relative z-10">
                        {order ? `হ্যালো ${order.name}, আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।` : 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।'} খুব শীঘ্রই আমাদের একজন প্রতিনিধি কল করে আপনার অর্ডারটি কনফার্ম করবেন।
                    </p>
                </div>

                {/* Details Area */}
                <div className="p-6 sm:p-8">
                    {order && (
                        <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Package size={16} /> অর্ডার সামারি
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                    <span className="text-gray-600 font-medium text-sm">অর্ডার আইডি</span>
                                    <span className="font-bold text-gray-900 text-sm font-mono bg-gray-100 px-2 rounded">#{order.id.slice(-6).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                    <span className="text-gray-600 font-medium text-sm">আইটেম</span>
                                    <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{order.item} <span className="text-gray-400 font-normal">x</span> {order.quantity}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                    <span className="text-gray-600 font-medium text-sm">পেমেন্ট মেথড</span>
                                    <span className="font-bold text-gray-900 text-[10px] sm:text-xs uppercase tracking-wide bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-200">Cash on Delivery</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="font-bold text-gray-700">মোট বিল (ডেলিভারি সহ)</span>
                                <span className="font-black text-2xl text-orange-600">৳{order.total}</span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-center">
                            <Truck size={24} className="mx-auto mb-2 text-orange-500" />
                            <h4 className="font-bold text-gray-900 text-sm mb-1">দ্রুত ডেলিভারি</h4>
                            <p className="text-xs text-gray-500">ঢাকা সিটিতে ৭২ ঘন্টা, ঢাকার বাইরে ৩-৫ দিন</p>
                        </div>
                        <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 text-center">
                            <ShieldCheck size={24} className="mx-auto mb-2 text-green-500" />
                            <h4 className="font-bold text-gray-900 text-sm mb-1">ফ্রেশ গ্যারান্টি</h4>
                            <p className="text-xs text-gray-500">সম্পূর্ণ মচমচে ও শতভাগ কেমিক্যাল মুক্ত</p>
                        </div>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                        href={`https://wa.me/8801679226855?text=Hello ILHAM's Kitchen, ${order ? `my order ID is #${order.id.slice(-6).toUpperCase()}. ` : ''}I just placed an order. I want to know the delivery status.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-bold transition shadow-md hover:shadow-lg mb-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <MessageCircle size={24} />
                            </div>
                            <div className="text-left">
                                <div className="text-base">WhatsApp-এ যোগাযোগ করুন</div>
                                <div className="text-xs text-green-100 font-medium font-mono">01679226855</div>
                            </div>
                        </div>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>

                    <Link
                        href="/"
                        className="block w-full text-center py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition bg-gray-50 hover:bg-gray-100 rounded-2xl"
                    >
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ThankYouPage({ searchParams }: { searchParams: { id?: string } }) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-orange-50"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div></div>}>
            <ThankYouContent searchParams={searchParams} />
        </Suspense>
    );
}

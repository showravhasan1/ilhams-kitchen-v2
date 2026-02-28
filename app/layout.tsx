import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
    subsets: ["bengali", "latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
    metadataBase: new URL('https://www.ilhamskitchen.com'),
    title: "ILHAM's Kitchen | প্রিমিয়াম পেঁয়াজ বেরেস্তা",
    description: "১০০% খাঁটি, হাতে তৈরি মচমচে পেঁয়াজ বেরেস্তা। কেমিক্যাল ফ্রি, এয়ারটাইট প্যাকেজিং। ক্যাশ অন ডেলিভারি। ঢাকায় ২৪ ঘন্টায় ডেলিভারি। এখনই অর্ডার করুন!",
    keywords: ['পেঁয়াজ বেরেস্তা', 'peyaj beresta', 'fried onion', 'ILHAM Kitchen', 'ইলহামস কিচেন', 'বেরেস্তা অর্ডার', 'crispy onion Bangladesh'],
    openGraph: {
        type: 'website',
        locale: 'bn_BD',
        url: 'https://www.ilhamskitchen.com',
        siteName: "ILHAM's Kitchen",
        title: "ILHAM's Kitchen | প্রিমিয়াম পেঁয়াজ বেরেস্তা",
        description: "১০০% খাঁটি মচমচে পেঁয়াজ বেরেস্তা। ক্যাশ অন ডেলিভারি। অর্ডার করুন!",
        images: [
            {
                url: '/og-cover.png',
                width: 1200,
                height: 630,
                alt: "ILHAM's Kitchen প্রিমিয়াম পেঁয়াজ বেরেস্তা",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "ILHAM's Kitchen | প্রিমিয়াম পেঁয়াজ বেরেস্তা",
        description: "১০০% খাঁটি মচমচে পেঁয়াজ বেরেস্তা। ক্যাশ অন ডেলিভারি। অর্ডার করুন!",
        images: ['/og-cover.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="bn" className="scroll-smooth" suppressHydrationWarning>
            <head />

            <body className={`${hindSiliguri.className} antialiased bg-gray-50 text-gray-900`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}

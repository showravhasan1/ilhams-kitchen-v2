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
                url: '/og-preview.png',
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
        images: ['/og-preview.png'],
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
            <head>
                {/* Facebook Pixel Code Example */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID'); // Replace with actual Pixel ID
              fbq('track', 'PageView');
            `,
                    }}
                />
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: 'none' }}
                        src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>
            </head>
            <body className={`${hindSiliguri.className} antialiased bg-gray-50 text-gray-900`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}

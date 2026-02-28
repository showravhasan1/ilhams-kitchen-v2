"use client";

import dynamic from 'next/dynamic';

const InteractiveSection = dynamic(() => import('./InteractiveSection'), {
    ssr: false,
    loading: () => (
        <div className="py-12 px-4 max-w-5xl mx-auto text-center">
            <div className="animate-pulse bg-gray-200 h-96 rounded-3xl"></div>
        </div>
    ),
});

export default function LazyInteractive() {
    return <InteractiveSection />;
}

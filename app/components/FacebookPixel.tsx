'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const FacebookPixel = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFirstLoad = useRef(true);

    useEffect(() => {
        // Skip the first load since the inline script in layout.tsx handles it
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }

        // Fire PageView on subsequent client-side route changes
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'PageView');
        }
    }, [pathname, searchParams]);

    return null;
};

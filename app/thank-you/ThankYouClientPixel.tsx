'use client';

import { useEffect, useRef } from 'react';

export const ThankYouClientPixel = ({ eventId, value }: { eventId: string; value: number }) => {
    const hasFired = useRef(false);

    useEffect(() => {
        if (hasFired.current) return;

        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', {
                currency: 'BDT',
                value: value,
            }, { eventID: eventId });
            hasFired.current = true;
        }
    }, [eventId, value]);

    return null;
};

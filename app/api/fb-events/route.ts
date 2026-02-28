import { NextResponse } from 'next/server';
import { sendFBEvent, generateEventId } from '@/lib/facebook';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { eventName, sourceUrl, fbc, fbp } = data;

        if (!eventName || !['ViewContent', 'InitiateCheckout'].includes(eventName)) {
            return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
        }

        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-real-ip')
            || '';
        const userAgent = req.headers.get('user-agent') || '';
        const eventId = generateEventId();

        await sendFBEvent({
            eventName,
            eventId,
            sourceUrl: sourceUrl || 'https://www.ilhamskitchen.com/',
            userData: {
                clientIp,
                userAgent,
                fbc: fbc || '',
                fbp: fbp || '',
            },
        });

        return NextResponse.json({ success: true, eventId });
    } catch (error: any) {
        console.error('[CAPI] Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

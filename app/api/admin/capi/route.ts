import { NextResponse } from 'next/server';
import { sendFBEvent } from '@/lib/facebook';

// Server-Side Facebook Conversions API (CAPI) Integration triggered from Admin Dashboard
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { order, pixelId, accessToken } = data;

        // Validation
        if (!order || !pixelId || !accessToken) {
            return NextResponse.json({ success: false, error: 'Missing required CAPI parameters' }, { status: 400 });
        }

        // We generate a deterministic pseudo-eventId based on the order ID 
        // We do this because the original browser session eventId is lost, 
        // but Since we removed the browser event entirely for purchases, 
        // deduplication against a browser event isn't necessary here.
        const eventId = `admin_confirm_${order.id}`;

        const nameParts = (order.name || '').trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

        // Safely send the high-quality hashed payload via our robust utility
        await sendFBEvent({
            eventName: 'Purchase',
            eventId: eventId,
            sourceUrl: 'https://www.ilhamskitchen.com/admin',
            userData: {
                phone: order.phone,
                firstName: firstName,
                lastName: lastName,
                clientIp: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '0.0.0.0',
                userAgent: req.headers.get('user-agent') || '',
                // Not passing fbc/fbp because admin is triggering this from a different browser session weeks later
                externalId: order.phone,
            },
            customData: {
                currency: 'BDT',
                value: order.total,
                content_name: order.item,
                content_type: 'product',
                num_items: order.quantity,
                order_id: order.id,
            },
        });

        return NextResponse.json({ success: true, message: 'CAPI Purchase Event Sent' });

    } catch (error: any) {
        console.error('CAPI route error:', error);
        return NextResponse.json({ success: false, error: 'Server error during CAPI transmission' }, { status: 500 });
    }
}

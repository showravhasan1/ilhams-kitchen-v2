import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendFBEvent, generateEventId } from '@/lib/facebook';

/* ─── Validation Helpers ─── */

// Valid BD mobile: 01[3-9]XXXXXXXX (11 digits)
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

function normalizePhone(raw: string): string {
    // Strip spaces, dashes, plus, country code
    let phone = raw.replace(/[\s\-\(\)]/g, '');
    if (phone.startsWith('+880')) phone = '0' + phone.slice(4);
    if (phone.startsWith('880')) phone = '0' + phone.slice(3);
    return phone;
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // ── 1. Phone Validation ──
        const phone = normalizePhone(data.phone || '');
        if (phone.length !== 11 || !BD_PHONE_REGEX.test(phone)) {
            return NextResponse.json(
                { success: false, error: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)' },
                { status: 400 }
            );
        }

        // ── 2. Duplicate Order Check (same phone within 24h) ──
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentOrder = await prisma.order.findFirst({
            where: {
                phone: phone,
                createdAt: { gte: twentyFourHoursAgo },
                status: { not: 'Cancelled' },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (recentOrder) {
            return NextResponse.json(
                { success: false, error: 'এই নম্বর দিয়ে ইতিমধ্যে একটি অর্ডার করা হয়েছে। ২৪ ঘন্টা পর আবার অর্ডার করতে পারবেন।' },
                { status: 429 }
            );
        }

        // ── 3. Create Order ──
        const eventId = generateEventId();
        const order = await prisma.order.create({
            data: {
                name: data.name,
                phone: phone,
                address: data.address,
                zone: data.zone,
                item: data.item,
                quantity: data.quantity,
                subtotal: data.subtotal,
                shipping: data.shipping,
                total: data.total,
                status: 'Pending',
            }
        });

        // ── 4. Send Facebook CAPI Purchase Event (non-blocking) ──
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-real-ip')
            || '';
        const userAgent = req.headers.get('user-agent') || '';

        sendFBEvent({
            eventName: 'Purchase',
            eventId,
            sourceUrl: 'https://www.ilhamskitchen.com/',
            userData: {
                phone,
                firstName: data.name?.split(' ')[0] || '',
                clientIp,
                userAgent,
                fbc: data.fbc || '',
                fbp: data.fbp || '',
            },
            customData: {
                currency: 'BDT',
                value: data.total,
                content_name: data.item,
                content_type: 'product',
                num_items: data.quantity,
                order_id: order.id,
            },
        }).catch(err => console.error('[FB CAPI] Background error:', err));

        return NextResponse.json({ success: true, order, eventId });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ success: false, error: 'দুঃখিত, আবার চেষ্টা করুন।', details: error.message }, { status: 500 });
    }
}


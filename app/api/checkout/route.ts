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

        // The Facebook CAPI Purchase Event is now deferred to the Admin Dashboard.
        // It will only fire when the admin manually changes the order status to "Confirmed"
        // to prevent fake orders/fraud from inflating Facebook's ad metrics.

        return NextResponse.json({ success: true, order, eventId });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ success: false, error: 'দুঃখিত, আবার চেষ্টা করুন।', details: error.message }, { status: 500 });
    }
}


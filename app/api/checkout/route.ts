import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const order = await prisma.order.create({
            data: {
                name: data.name,
                phone: data.phone,
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

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create order', details: error.message }, { status: 500 });
    }
}

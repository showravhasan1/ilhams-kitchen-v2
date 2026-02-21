import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const password = searchParams.get('password');

        // Simple authentication
        if (password !== 'ilham2026') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const password = searchParams.get('password');
        const id = searchParams.get('id');

        if (password !== 'ilham2026') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ success: false, error: 'Order ID required' }, { status: 400 });
        }

        await prisma.order.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete order error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete order' }, { status: 500 });
    }
}

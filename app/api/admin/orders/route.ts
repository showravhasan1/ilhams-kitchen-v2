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

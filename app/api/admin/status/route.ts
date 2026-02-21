import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { id, status, password } = data;

        // Simple authentication
        if (password !== 'ilham2026') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error('Update status error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
    }
}

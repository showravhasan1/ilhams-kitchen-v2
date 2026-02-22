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

        // Trigger Facebook CAPI if the status is changed to "Confirmed"
        if (status === 'Confirmed') {
            try {
                // Ensure we get the full absolute URL for the fetch call in Next.js Serverless functions
                const host = req.headers.get('host');
                const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
                const baseUrl = `${protocol}://${host}`;

                // Only trigger if the Admin provided the Pixel ID and Access Token in their .env
                // For now, these are hardcoded placeholders or env variables for the user to fill in
                const pixelId = process.env.FB_PIXEL_ID || 'PENDING_USER_PIXEL_ID';
                const accessToken = process.env.FB_CAPI_TOKEN || 'PENDING_USER_TOKEN';

                await fetch(`${baseUrl}/api/admin/capi`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order,
                        pixelId,
                        accessToken
                    })
                });
                console.log(`CAPI Event Triggered for Order ${id}`);
            } catch (capiError) {
                console.error('Failed to trigger CAPI from status update:', capiError);
                // We do not fail the overall status update if CAPI fails
            }
        }

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error('Update status error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
    }
}

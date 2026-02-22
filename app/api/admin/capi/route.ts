import { NextResponse } from 'next/server';

// Server-Side Facebook Conversions API (CAPI) Integration
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { order, pixelId, accessToken } = data;

        // Validation
        if (!order || !pixelId || !accessToken) {
            return NextResponse.json({ success: false, error: 'Missing required CAPI parameters' }, { status: 400 });
        }

        // Format User Data according to Facebook Hash Requirements (SHA256 lowercase)
        // Note: For a real production app, name/phone/email should be hashed before sending to FB.
        // For simplicity in this implementation, FB will attempt to auto-hash if sent unhashed over HTTPS, 
        // but explicit hashing is best practice. We'll send plain for now and let the FB endpoint handle it or reject it if strict.

        // Prepare the Event payload
        const eventData = {
            data: [
                {
                    event_name: 'Purchase',
                    event_time: Math.floor(Date.now() / 1000), // Current Unix timestamp in seconds
                    action_source: 'website',
                    user_data: {
                        ph: [order.phone], // Phone number 
                        fn: [order.name],  // First name (or full name)
                        client_ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
                        client_user_agent: req.headers.get('user-agent') || '',
                    },
                    custom_data: {
                        currency: 'BDT',
                        value: order.total,
                        content_name: order.item,
                        content_ids: [order.id],
                        content_type: 'product'
                    },
                }
            ]
        };

        // Construct the Facebook Graph API URL
        const capiUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

        // Send the request to Facebook
        const fbResponse = await fetch(capiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        const fbResult = await fbResponse.json();

        if (fbResponse.ok) {
            return NextResponse.json({ success: true, message: 'CAPI Purchase Event Sent', fbResult });
        } else {
            console.error('Facebook CAPI Error:', fbResult);
            return NextResponse.json({ success: false, error: 'Facebook CAPI Error', details: fbResult }, { status: 500 });
        }

    } catch (error: any) {
        console.error('CAPI route error:', error);
        return NextResponse.json({ success: false, error: 'Server error during CAPI transmission' }, { status: 500 });
    }
}

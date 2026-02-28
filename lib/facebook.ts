import crypto from 'crypto';

const FB_PIXEL_ID = process.env.FB_PIXEL_ID || '2700364103657577';
const FB_CAPI_TOKEN = process.env.FB_CAPI_TOKEN || '';
const FB_API_VERSION = 'v21.0';

function sha256Hash(value: string): string {
    return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

interface UserData {
    phone?: string;
    firstName?: string;
    lastName?: string;
    clientIp?: string;
    userAgent?: string;
    fbc?: string;
    fbp?: string;
    externalId?: string;
}

interface EventData {
    eventName: string;
    eventId: string;
    sourceUrl: string;
    userData: UserData;
    customData?: Record<string, any>;
}

export async function sendFBEvent(event: EventData) {
    if (!FB_CAPI_TOKEN) {
        console.warn('[FB CAPI] No access token configured, skipping event:', event.eventName);
        return null;
    }

    const userData: Record<string, any> = {
        client_user_agent: event.userData.userAgent || '',
    };

    // Hash PII fields before sending (Facebook requires SHA-256 hashed arrays)
    if (event.userData.phone) {
        // Normalize BD phone to international format without +
        let phone = event.userData.phone.replace(/[^0-9]/g, '');
        if (phone.startsWith('0')) phone = '880' + phone.slice(1);
        userData.ph = [sha256Hash(phone)];
    }

    if (event.userData.firstName) {
        userData.fn = [sha256Hash(event.userData.firstName)];
    }

    if (event.userData.lastName) {
        userData.ln = [sha256Hash(event.userData.lastName)];
    }

    // Client IP (do NOT hash)
    if (event.userData.clientIp) {
        userData.client_ip_address = event.userData.clientIp;
    }

    // Facebook click ID cookie (do NOT hash)
    if (event.userData.fbc) {
        userData.fbc = event.userData.fbc;
    }

    // Facebook browser ID cookie (do NOT hash)
    if (event.userData.fbp) {
        userData.fbp = event.userData.fbp;
    }

    // External ID for cross-device matching (hashed)
    if (event.userData.externalId) {
        userData.external_id = [sha256Hash(event.userData.externalId)];
    }

    // Always set country to Bangladesh
    userData.country = [sha256Hash('bd')];

    const payload = {
        data: [
            {
                event_name: event.eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: event.eventId,
                event_source_url: event.sourceUrl,
                action_source: 'website',
                user_data: userData,
                custom_data: event.customData || {},
            },
        ],
    };

    try {
        const url = `https://graph.facebook.com/${FB_API_VERSION}/${FB_PIXEL_ID}/events?access_token=${FB_CAPI_TOKEN}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok) {
            console.error('[FB CAPI] Error:', JSON.stringify(result));
        } else {
            console.log('[FB CAPI] Event sent:', event.eventName, result);
        }

        return result;
    } catch (error) {
        console.error('[FB CAPI] Failed to send event:', error);
        return null;
    }
}

export function generateEventId(): string {
    return crypto.randomUUID();
}

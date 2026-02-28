const { sendFBEvent } = require('./lib/facebook');
require('dotenv').config();

async function trigger() {
    console.log("Triggering FB CAPI Test Event TEST83949...");
    await sendFBEvent({
        eventName: 'Purchase',
        eventId: 'test_order_instant_1',
        sourceUrl: 'https://www.ilhamskitchen.com/admin',
        userData: {
            phone: '01711000000',
            firstName: 'Instant Test User',
            lastName: 'Test',
            clientIp: '127.0.0.1',
            externalId: '01711000000'
        },
        customData: {
            currency: 'BDT',
            value: 999,
            content_name: '500g Premium Peyaj Beresta',
            content_type: 'product',
            num_items: 1,
            order_id: 'test_order_instant_1'
        }
    });
    console.log("Done.");
}

trigger();

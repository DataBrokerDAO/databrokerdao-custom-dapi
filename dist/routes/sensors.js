"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const purchaseRegistry_1 = require("../dapi/purchaseRegistry");
const sensorRegistry_1 = require("../dapi/sensorRegistry");
const sensorupdate_1 = require("../mail/sensorupdate");
const client_1 = require("../services/mongo/client");
async function sensorDataRoute(req, res) {
    try {
        console.log(`Received data for sensor ${req.body.key}`);
        const sensorId = req.body.key;
        const sensor = req.body;
        if (typeof sensor.key === 'undefined') {
            return res.sendStatus(400);
        }
        // Return early if there are no purchases
        const sensorAddresses = await sensorRegistry_1.getSensorAddressesForSensorId(sensorId);
        if (sensorAddresses === undefined || sensorAddresses === []) {
            return res.sendStatus(404);
        }
        for (const sensorAddress of sensorAddresses) {
            if (!sensor) {
                console.log(`Could not find sensor ${sensorId}, possible race condition`);
                return res.sendStatus(404);
            }
            let purchases;
            try {
                purchases = await purchaseRegistry_1.getSensorPurchasesForSensorKey(sensorAddress);
            }
            catch (error) {
                return res.sendStatus(424); // Failed Dependency
            }
            if (purchases) {
                if (!purchases.length) {
                    return res.sendStatus(200);
                }
                for (const purchase of purchases) {
                    if (isSubscriptionValid(purchase) && isSubscribed(purchase)) {
                        await sensorupdate_1.sendSensorUpdate(purchase.email, sensor, sensorAddress);
                    }
                }
                console.log(`${sensorId} succesfully executed!`);
                return res.sendStatus(200);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.sensorDataRoute = sensorDataRoute;
function isSubscriptionValid(purchase) {
    const isSubscriptionStarted = purchase.startTime < Math.floor(Date.now() / 1000);
    const isSubscriptionNotEnded = Math.floor(Date.now() / 1000) < purchase.endTime;
    return isSubscriptionStarted && isSubscriptionNotEnded;
}
async function isSubscribed(sensorPurchase) {
    const mailRegistry = await client_1.getCollection('mailregistry');
    const subscriptionDocument = await mailRegistry.findOne({
        email: sensorPurchase.email,
        status: 'subscribed',
        sensorid: sensorPurchase.sensor
    });
    return subscriptionDocument != null;
}
//# sourceMappingURL=sensors.js.map
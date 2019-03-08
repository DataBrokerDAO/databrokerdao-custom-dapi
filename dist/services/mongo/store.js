"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("validator");
const purchaseRegistry_1 = require("../../dapi/purchaseRegistry");
const client_1 = require("./client");
async function getMailSubscribersBySensor(purchaseKey) {
    try {
        const collection = await client_1.getCollection('mailRegistry');
        const purchases = await collection.find({ key: purchaseKey });
        return purchases.toArray();
    }
    catch (error) {
        throw error;
    }
}
exports.getMailSubscribersBySensor = getMailSubscribersBySensor;
async function addNotSubscribedUsersToDb(purchaseDict) {
    for (const sensorId of Object.keys(purchaseDict)) {
        const sensorPurchases = purchaseDict[sensorId];
        sensorPurchases.map(verifySubscription);
    }
}
exports.addNotSubscribedUsersToDb = addNotSubscribedUsersToDb;
async function verifySubscription(sensorPurchase) {
    const mailRegistry = await client_1.getCollection('mailregistry');
    if (validator_1.isEmail(sensorPurchase.email)) {
        const subscriptionDocument = await mailRegistry.findOne({
            email: sensorPurchase.email,
            sensorid: sensorPurchase.sensor
        });
        if (subscriptionDocument == null) {
            mailRegistry.insertOne({
                email: sensorPurchase.email,
                status: 'subscribed',
                sensorid: sensorPurchase.sensor
            });
            purchaseRegistry_1.sendSensorPurchaseRegistered(sensorPurchase);
        }
    }
}
//# sourceMappingURL=store.js.map
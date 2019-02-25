"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../services/mongo/client");
async function subscribe(email, sensorid) {
    const collection = await client_1.getCollection('mailregistry');
    const subscription = {
        email: email,
        sensorid: sensorid,
        status: 'subscribed'
    };
    await collection.insert(subscription);
    return subscription;
}
exports.subscribe = subscribe;
async function unsubscribe(email, sensorid) {
    const collection = await client_1.getCollection('mailregistry');
    if (sensorid) {
        await collection.updateOne({
            email: email,
            status: 'subscribed',
            sensorid: sensorid
        }, {
            $set: {
                status: 'unsubscribed'
            }
        });
    }
    else {
        await collection.updateMany({
            email: email
        }, {
            $set: {
                status: 'unsubscribed'
            }
        });
    }
}
exports.unsubscribe = unsubscribe;
async function isSubscribed(email, sensorid) {
    const collection = await client_1.getCollection('mailregistry');
    const record = await collection.findOne({
        email: email,
        sensorid: sensorid,
        status: 'subscribed'
    });
    return typeof record !== 'undefined' && record !== null;
}
exports.isSubscribed = isSubscribed;
//# sourceMappingURL=registries.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
// TODO: remove
async function watch(collectionName, handler) {
    try {
        const collection = await client_1.getCollection(collectionName);
        collection.watch().on('change', handler);
    }
    catch (error) {
        throw error;
    }
}
exports.watch = watch;
async function getSensorForKey(key) {
    try {
        const collection = await client_1.getCollection('sensorregistry-items');
        return collection.findOne({ key });
    }
    catch (error) {
        throw error;
    }
}
exports.getSensorForKey = getSensorForKey;
async function getSensorForSensorId(sensorid) {
    try {
        const collection = await client_1.getCollection('sensorregistry-items');
        return collection.findOne({ sensorid });
    }
    catch (error) {
        throw error;
    }
}
exports.getSensorForSensorId = getSensorForSensorId;
async function getPurchasesForSensorKey(sensorKey) {
    try {
        const collection = await client_1.getCollection('purchaseregistry-items');
        const purchases = await collection.find({ sensor: sensorKey });
        return purchases.toArray();
    }
    catch (error) {
        throw error;
    }
}
exports.getPurchasesForSensorKey = getPurchasesForSensorKey;
async function getPurchasesForPurchaseKey(purchaseKey) {
    try {
        const collection = await client_1.getCollection('purchaseregistry-items');
        const purchases = await collection.find({ key: purchaseKey });
        return purchases.toArray();
    }
    catch (error) {
        throw error;
    }
}
exports.getPurchasesForPurchaseKey = getPurchasesForPurchaseKey;
//# sourceMappingURL=store.js.map
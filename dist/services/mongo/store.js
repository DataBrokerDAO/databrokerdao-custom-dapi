"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
async function watch(collectionName, handler) {
    const collection = await client_1.getDbCollection(collectionName);
    collection.watch().on('change', handler);
}
exports.watch = watch;
async function getSensorForKey(key) {
    let collection = await client_1.getDbCollection('sensorregistry-items');
    return collection.findOne({ key: key });
}
exports.getSensorForKey = getSensorForKey;
async function getSensorForSensorId(sensorid) {
    let collection = await client_1.getDbCollection('sensorregistry-items');
    return collection.findOne({ sensorid: sensorid });
}
exports.getSensorForSensorId = getSensorForSensorId;
async function getPurchasesForSensorKey(sensorKey) {
    let collection = await client_1.getDbCollection('purchaseregistry-items');
    let purchases = await collection.find({ sensor: sensorKey });
    return purchases.toArray();
}
exports.getPurchasesForSensorKey = getPurchasesForSensorKey;
async function getPurchasesForPurchaseKey(purchaseKey) {
    let collection = await client_1.getDbCollection('purchaseregistry-items');
    let purchases = await collection.find({ key: purchaseKey });
    return purchases.toArray();
}
exports.getPurchasesForPurchaseKey = getPurchasesForPurchaseKey;
//# sourceMappingURL=store.js.map
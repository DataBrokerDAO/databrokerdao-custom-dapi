"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const transform_1 = require("../util/transform");
let purchaseDictionary = {};
async function updateSensorPurchases() {
    const sensorPurchases = await getSensorPurchases();
    purchaseDictionary = transform_1.transformSensorPurchasesToSensorKeyPurchases(sensorPurchases);
}
exports.updateSensorPurchases = updateSensorPurchases;
async function getSensorPurchases() {
    try {
        console.log('Fetching sensorpurchases');
        const response = await axios_1.default.get(`/purchaseregistry/list?abi=false`);
        console.log('Finished fetching sensorpurchases');
        return response.data.items;
    }
    catch (error) {
        throw error;
    }
}
// TODO: Implement caching to avoid dos issues on the server?
async function getSensorPurchasesForSensorKey(sensorId) {
    console.log(`Fetching sensorpurchase for ${sensorId}`);
    const sensorPurchases = purchaseDictionary[sensorId] ||
        (await querySensorPurchasesForSensorKey(sensorId));
    return sensorPurchases;
}
exports.getSensorPurchasesForSensorKey = getSensorPurchasesForSensorKey;
async function querySensorPurchasesForSensorKey(sensorId) {
    try {
        const response = await axios_1.default.get(buildSensorKeyUrl(sensorId));
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
exports.querySensorPurchasesForSensorKey = querySensorPurchasesForSensorKey;
function buildSensorKeyUrl(sensorId) {
    return `/purchaseregistry/list?abi=false&item.sensor=~${sensorId}`;
}
//# sourceMappingURL=purchase.js.map
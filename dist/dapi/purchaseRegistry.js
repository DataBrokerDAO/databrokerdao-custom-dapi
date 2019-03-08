"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dapi_config_1 = require("../config/dapi-config");
const mailer_1 = require("../mail/mailer");
const store_1 = require("../services/mongo/store");
const transform_1 = require("../util/transform");
let purchaseDictionary = {};
async function updateSensorPurchases() {
    const sensorPurchases = await getSensorPurchases();
    purchaseDictionary = transform_1.transformSensorPurchasesToSensorKeyPurchases(sensorPurchases);
    store_1.addNotSubscribedUsersToDb(purchaseDictionary);
}
exports.updateSensorPurchases = updateSensorPurchases;
async function getSensorPurchases() {
    try {
        const response = await axios_1.default.get(`/purchaseregistry/list?abi=false`);
        return response.data.items;
    }
    catch (error) {
        throw error;
    }
}
// TODO: Remove?
// export async function getSensorPurchasesForSensorKey(sensorId: string) {
//   console.log(`Fetching sensorpurchase for ${sensorId}`);
//   if (purchaseDictionary[sensorId] === undefined) {
//     const purchases: IRawPurchase[] = await querySensorPurchasesForSensorKey(
//       sensorId
//     );
//     purchaseDictionary[sensorId] = [];
//     purchaseDictionary = await transformSensorPurchasesToSensorKeyPurchases(
//       purchases
//     );
//   }
//   addNotSubscribedUsersToDb(purchaseDictionary);
//   return purchaseDictionary[sensorId];
// }
async function getSensorPurchasesForSensorKey(sensorId) {
    try {
        const response = await axios_1.default.get(buildSensorKeyUrl(sensorId));
        return response.data.items;
    }
    catch (error) {
        throw error;
    }
}
exports.getSensorPurchasesForSensorKey = getSensorPurchasesForSensorKey;
function buildSensorKeyUrl(sensorId) {
    return `/purchaseregistry/list?abi=false&item.sensor=~${sensorId}`;
}
async function sendSensorPurchaseRegistered(sensorPurchase) {
    mailer_1.sendPurchased(dapi_config_1.SENDGRID_FROM_EMAIL, sensorPurchase.email, 'Sensor update', dapi_config_1.SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS, {
        sensor_name: sensorPurchase.sensor,
        current_year: 2019,
        subject: 'Sensor update'
    });
}
exports.sendSensorPurchaseRegistered = sendSensorPurchaseRegistered;
//# sourceMappingURL=purchaseRegistry.js.map
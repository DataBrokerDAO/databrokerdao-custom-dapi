"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const purchase_1 = require("../dapi/purchase");
async function sensorPurchaseCron() {
    purchase_1.updateSensorPurchases();
}
exports.sensorPurchaseCron = sensorPurchaseCron;
//# sourceMappingURL=purchases.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function transformSensorsToSensorsIdKeyPair(sensors) {
    const sensorIdKeyPair = {};
    for (const sensor of sensors) {
        sensorIdKeyPair[sensor.sensorid] = sensor.contractAddress;
    }
    return sensorIdKeyPair;
}
exports.transformSensorsToSensorsIdKeyPair = transformSensorsToSensorsIdKeyPair;
function transformSensorPurchasesToSensorKeyPurchases(purchases) {
    const sensorPurchases = {};
    for (const sensorPurchase of purchases) {
        if (sensorPurchase[sensorPurchase.sensor] === undefined) {
            sensorPurchase[sensorPurchase.sensor] = [];
        }
        const newSensorPurchase = {
            email: sensorPurchase.email,
            endtime: sensorPurchase.endtime
        };
        sensorPurchase[sensorPurchase.sensor].push(newSensorPurchase);
    }
    return sensorPurchases;
}
exports.transformSensorPurchasesToSensorKeyPurchases = transformSensorPurchasesToSensorKeyPurchases;
//# sourceMappingURL=transform.js.map
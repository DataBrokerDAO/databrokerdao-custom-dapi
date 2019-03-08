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
        if (sensorPurchases[sensorPurchase.sensor] === undefined) {
            sensorPurchases[sensorPurchase.sensor] = [];
        }
        const newSensorPurchase = {
            startTime: sensorPurchase.startTime,
            email: sensorPurchase.email,
            endTime: sensorPurchase.endTime,
            sensor: sensorPurchase.sensor
        };
        sensorPurchases[sensorPurchase.sensor].push(newSensorPurchase);
    }
    return sensorPurchases;
}
exports.transformSensorPurchasesToSensorKeyPurchases = transformSensorPurchasesToSensorKeyPurchases;
//# sourceMappingURL=transform.js.map
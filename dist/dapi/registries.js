"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const transform_1 = require("../util/transform");
let sensorKeys = {};
async function getSensorKeyForSensorId(sensorId) {
    const sensorKey = sensorKeys[sensorId] || (await querySensorKeyById(sensorId));
    return sensorKey;
}
exports.getSensorKeyForSensorId = getSensorKeyForSensorId;
async function updateSensorKeys() {
    console.log('Updating sensorkeys');
    const sensors = await getSensors();
    sensorKeys = transform_1.transformSensorsToSensorsIdKeyPair(sensors);
    console.log('Finished fetching sensorkeys');
}
exports.updateSensorKeys = updateSensorKeys;
async function querySensorKeyById(sensorId) {
    try {
        const response = await axios_1.default.get(buildSensorQueryUrl(sensorId));
        if (Array.isArray(response.data.items) && response.data.items.length > 0) {
            const sensor = response.data.items[0];
            sensorKeys[sensorId] = sensor.contractAddress;
            return sensor.contractAddress;
        }
        else {
            throw new Error('Sensor not found');
        }
    }
    catch (error) {
        throw error;
    }
}
async function getSensors() {
    try {
        const response = await axios_1.default.get(`/sensorregistry/list?abi=false`);
        return response.data.items;
    }
    catch (error) {
        throw error;
    }
}
function buildSensorQueryUrl(sensorId) {
    const encodedId = encodeURIComponent(sensorId);
    return `/sensorregistry/list?abi=false&item.sensorid=${encodedId}`;
}
//# sourceMappingURL=registries.js.map
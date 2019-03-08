"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const set = require("lodash.set");
const sensorIdToAddress = {};
const sensorAddressToId = {};
async function getSensorAddressesForSensorId(sensorId) {
    return sensorIdToAddress[sensorId]
        ? Object.keys(sensorIdToAddress[sensorId])
        : querySensorAddressById(sensorId);
}
exports.getSensorAddressesForSensorId = getSensorAddressesForSensorId;
async function updateSensorAddresses() {
    const sensors = await getSensors();
    for (const sensor of sensors) {
        set(sensorIdToAddress, `${sensor.sensorid}.${sensor.contractAddress.toLowerCase()}`, true);
        sensorAddressToId[sensor.contractAddress.toLowerCase()] = sensor.sensorid;
    }
}
exports.updateSensorAddresses = updateSensorAddresses;
async function querySensorAddressById(sensorId) {
    try {
        const response = await axios_1.default.get(buildSensorQueryUrl(sensorId));
        if (Array.isArray(response.data.items) && response.data.items.length > 0) {
            for (const sensor of response.data.items) {
                set(sensorIdToAddress, `${sensor.sensorid}.${sensor.contractAddress.toLowerCase()}`, true);
                sensorAddressToId[sensor.contractAddress.toLowerCase()] =
                    sensor.sensorid;
            }
            return Object.keys(sensorIdToAddress[sensorId]);
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
//# sourceMappingURL=sensorRegistry.js.map
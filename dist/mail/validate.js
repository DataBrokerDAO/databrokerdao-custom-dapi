"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const dapi_config_1 = require("../config/dapi-config");
function validateUnsubscribe(requestContent, res) {
    if (!isValidEmail(requestContent[0])) {
        res.sendStatus(400);
    }
    if (!isValidInput(requestContent[1])) {
        res.sendStatus(400);
    }
}
exports.validateUnsubscribe = validateUnsubscribe;
function isValidEmail(email) {
    return validator_1.default.isEmail(email);
}
function isValidInput(sensorId) {
    const sensorIdParts = sensorId.split(dapi_config_1.DELIMITER_SENSOR);
    return (sensorId !== undefined && sensorId !== null && sensorIdParts.length === 3);
}
//# sourceMappingURL=validate.js.map
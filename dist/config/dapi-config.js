"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const rtrim_1 = __importDefault(require("rtrim"));
dotenv_1.default.load();
exports.DELIMITER_HASH = '||';
exports.DELIMITER_SENSOR = '!#!';
exports.DATABROKER_DAPP_BASE_URL = rtrim_1.default(process.env.DATABROKER_DAPP_BASE_URL);
exports.MONGO_DB_URL = rtrim_1.default(process.env.MONGO_DB_URL);
exports.MONGO_DB_NAME = process.env.MONGO_DB_NAME;
// export const MONGO_DB_SENSOR_COLLECTION: string =
//   process.env.MONGO_DB_SENSOR_COLLECTION;
exports.MIDDLEWARE_URL = rtrim_1.default(process.env.MIDDLEWARE_URL);
exports.MIDDLEWARE_PORT = parseInt(process.env.MIDDLEWARE_PORT, 10) || 3000;
exports.MANDRILL_API_KEY = process.env.MIDDLEWARE_PORT;
exports.MANDRILL_TEMPLATE_SLUG_SENSOR_UPDATE = process.env.MIDDLEWARE_PORT;
exports.MANDRILL_TEMPLATE_SLUG_SENSOR_REGISTRATION = process.env.MIDDLEWARE_PORT;
exports.MANDRILL_TEMPLATE_SLUG_DATASET_CREDENTIALS = process.env.MIDDLEWARE_PORT;
exports.DATABROKER_DAPI_USERNAME = process.env.DATABROKER_DAPI_USERNAME;
exports.DATABROKER_DAPI_PASSWORD = process.env.DATABROKER_DAPI_PASSWORD;
exports.DATABROKER_DAPI_BASE_URL = rtrim_1.default(process.env.DATABROKER_DAPI_BASE_URL || 'https://d3v.databrokerdao.com/dapi', '/');
//# sourceMappingURL=dapi-config.js.map
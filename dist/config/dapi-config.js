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
exports.DATABROKER_DAPI_USERNAME = process.env.DATABROKER_DAPI_USERNAME;
exports.DATABROKER_DAPI_PASSWORD = process.env.DATABROKER_DAPI_PASSWORD;
exports.DATABROKER_DAPI_BASE_URL = rtrim_1.default(process.env.DATABROKER_DAPI_BASE_URL || 'https://d3v.databrokerdao.com/dapi', '/');
exports.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
exports.SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
exports.SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE = process.env.SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE;
exports.SENDGRID_TEMPLATE_SLUG_SENSOR_REGISTRATION = process.env.SENDGRID_TEMPLATE_SLUG_SENSOR_REGISTRATION;
exports.SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS = process.env.SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS;
exports.MONGO_DB_URL = rtrim_1.default(process.env.MONGO_DB_URL);
exports.MONGO_DB_NAME = process.env.MONGO_DB_NAME;
exports.MIDDLEWARE_URL = rtrim_1.default(process.env.MIDDLEWARE_URL);
exports.MIDDLEWARE_PORT = parseInt(process.env.MIDDLEWARE_PORT, 10) || 3000;
//# sourceMappingURL=dapi-config.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dapi_config_1 = require("../config/dapi-config");
let authToken;
async function authenticate() {
    try {
        if (!authenticated()) {
            const response = await axios_1.default.post(`/v1/users/authenticate`, {
                username: dapi_config_1.DATABROKER_DAPI_USERNAME,
                password: dapi_config_1.DATABROKER_DAPI_PASSWORD
            });
            authToken = response.data.jwtToken;
            axios_1.default.defaults.headers.common.Authorization = authToken;
        }
        return authToken;
    }
    catch (error) {
        console.error('Failed to authenticate with error', error);
        throw error;
    }
}
exports.authenticate = authenticate;
function authenticated() {
    return typeof authToken !== 'undefined';
}
//# sourceMappingURL=auth.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const dapi_config_1 = require("../config/dapi-config");
const registries_1 = require("./registries");
async function unsubscribeRoute(req, res) {
    const hash = Buffer.from(req.query.hash, 'base64').toString('utf8');
    const parts = hash.split(dapi_config_1.DELIMITER_HASH);
    if (parts.length < 1) {
        res.sendStatus(400);
    }
    // Validate user input - email
    const email = parts[0];
    const sensorid = parts[1];
    if (!validator.isEmail(email)) {
        res.sendStatus(400);
    }
    try {
        await registries_1.unsubscribe(email, sensorid);
        const unsubscribedUrl = `${dapi_config_1.DATABROKER_DAPP_BASE_URL}/unsubscribed`;
        res.redirect(unsubscribedUrl);
    }
    catch (error) {
        res.send(error).status(200);
    }
}
exports.unsubscribeRoute = unsubscribeRoute;
//# sourceMappingURL=unsubscribe.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dapi_config_1 = require("../config/dapi-config");
const validate_1 = require("./validate");
async function unsubscribeRoute(req, res) {
    const hash = new Buffer(req.query.hash, 'base64').toString('utf8');
    const requestContent = hash.split(dapi_config_1.DELIMITER_HASH);
    if (requestContent.length < 1) {
        res.sendStatus(400);
    }
    await validate_1.validateUnsubscribe(requestContent, res);
    try {
        const unsubscribeUrl = `${dapi_config_1.DATABROKER_DAPP_BASE_URL}/unsubscribed`;
        res.redirect(unsubscribeUrl);
    }
    catch (error) {
        res.send(error).status(200);
    }
}
exports.unsubscribeRoute = unsubscribeRoute;
//# sourceMappingURL=unsubscribe.js.map
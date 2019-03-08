"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = require("@sendgrid/mail");
const axios_1 = __importDefault(require("axios"));
const bodyParser = require("body-parser");
const cron_1 = require("cron");
const express_1 = __importDefault(require("express"));
const dapi_config_1 = require("./config/dapi-config");
const auth_1 = require("./dapi/auth");
const purchaseRegistry_1 = require("./dapi/purchaseRegistry");
const sensorRegistry_1 = require("./dapi/sensorRegistry");
const unsubscribe_1 = require("./mail/unsubscribe");
const sensors_1 = require("./routes/sensors");
exports.app = express_1.default();
exports.app.use(bodyParser.json());
exports.app.get('/debug', (req, res, next) => {
    res.send('Running').status(200);
});
exports.app.post('/sensor/data', sensors_1.sensorDataRoute);
exports.app.get('/unsubscribe', unsubscribe_1.unsubscribeRoute);
function bootstrap() {
    exports.app.listen(dapi_config_1.MIDDLEWARE_PORT, () => {
        console.log(`Listening on port ${dapi_config_1.MIDDLEWARE_PORT}`);
    });
}
async function init() {
    axios_1.default.defaults.baseURL = dapi_config_1.DATABROKER_DAPI_BASE_URL;
    mail_1.setApiKey(dapi_config_1.SENDGRID_API_KEY);
    await auth_1.authenticate();
    sensorRegistry_1.updateSensorAddresses();
    purchaseRegistry_1.updateSensorPurchases();
    new cron_1.CronJob('* */10 * * *', purchaseRegistry_1.updateSensorPurchases, purchaseRegistry_1.updateSensorPurchases, true, 'Europe/Brussels').start();
}
bootstrap();
init();
//# sourceMappingURL=server.js.map
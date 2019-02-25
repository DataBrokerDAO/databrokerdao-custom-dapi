"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = __importDefault(require("../mailer"));
require('dotenv').config();
async function sendDataSetCredentials(recipient, sensor, credentials) {
    const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
    const subject = `You successfully purchased '${sensor.name}'`;
    const globalMergeVars = getGlobalMergeVars(sensor, credentials);
    await mailer_1.default.send(emailFrom, recipient, subject, [], // no attachments
    globalMergeVars, [], // no merge vars
    process.env.MANDRILL_TEMPLATE_SLUG_DATASET_CREDENTIALS);
}
exports.sendDataSetCredentials = sendDataSetCredentials;
function getGlobalMergeVars(sensor, credentials) {
    return [
        {
            name: 'SENSOR_NAME',
            content: sensor.name
        },
        {
            name: 'DATASET_URL',
            content: credentials.url
        }
    ];
}
//# sourceMappingURL=datasetcredentials.js.map
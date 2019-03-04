"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dapi_config_1 = require("../../config/dapi-config");
const mailer_1 = require("../mailer");
async function sendDataSetCredentials(recipient, sensor, credentials) {
    const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
    const subject = `You successfully purchased '${sensor.name}'`;
    const globalMergeVars = getGlobalMergeVars(sensor, credentials);
    await mailer_1.send(emailFrom, recipient, subject, [], // no attachments
    globalMergeVars, [], // no merge vars
    dapi_config_1.MANDRILL_TEMPLATE_SLUG_DATASET_CREDENTIALS);
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
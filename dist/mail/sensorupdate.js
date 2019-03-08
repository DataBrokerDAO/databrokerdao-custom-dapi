"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dapi_config_1 = require("../config/dapi-config");
const mailer_1 = require("./mailer");
async function sendSensorUpdate(email, sensor, sensorAddress) {
    const attachments = CreateSensorUpdateAttachment(sensor);
    mailer_1.sendUpdate(dapi_config_1.SENDGRID_FROM_EMAIL, email, 'Sensor update', dapi_config_1.SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE, {
        sensor_name: sensor.key,
        current_year: 2019,
        subject: 'Sensor update',
        sensor_unsubscribe_single: getUnsubscribeSingleUrl(email, sensor, sensorAddress),
        sensor_unsubscribe_all: getUnsubscribeAllUrl(email)
    }, attachments);
}
exports.sendSensorUpdate = sendSensorUpdate;
function CreateSensorUpdateAttachment(sensor) {
    const data = JSON.stringify(sensor);
    const content = Buffer.from(data).toString('base64');
    const attachments = [
        {
            type: 'application/json',
            filename: 'sensorupdate.json',
            content
        }
    ];
    return attachments;
}
function getUnsubscribeSingleUrl(email, sensor, sensorAddress) {
    const unsubscribeHash = Buffer.from(`${email}${dapi_config_1.DELIMITER_HASH}${sensorAddress}`).toString('base64');
    const unsubscribeUrl = `${dapi_config_1.MIDDLEWARE_URL}/unsubscribe?hash=${unsubscribeHash}`;
    return unsubscribeUrl;
}
function getUnsubscribeAllUrl(email) {
    const unsubscribeHash = Buffer.from(email).toString('base64');
    const unsubscribeUrl = `${dapi_config_1.MIDDLEWARE_URL}/unsubscribe?hash=${unsubscribeHash}`;
    return unsubscribeUrl;
}
//# sourceMappingURL=sensorupdate.js.map
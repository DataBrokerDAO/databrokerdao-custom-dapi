"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = __importDefault(require("../mailer"));
async function send(recipient, sensor) {
    const emailFrom = 'Databroker DAO <dao@databrokerdao.com>';
    const subject = `Sensor Registration '${sensor.name}'`;
    const globalMergeVars = getGlobalMergeVars(sensor);
    mailer_1.default.send(emailFrom, recipient, subject, [], // No attachments
    globalMergeVars, [], // No merge vars
    process.env.MANDRILL_TEMPLATE_SLUG_SENSOR_REGISTRATION);
}
exports.send = send;
function getGlobalMergeVars(sensor) {
    return [
        {
            name: 'SENSOR_NAME',
            content: sensor.name
        }
    ];
}
//# sourceMappingURL=sensorregister.js.map
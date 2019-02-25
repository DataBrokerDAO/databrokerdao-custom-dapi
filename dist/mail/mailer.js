"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mandrill_nodemailer_transport_1 = require("mandrill-nodemailer-transport");
require('dotenv').config();
let transporter;
function createTransporter() {
    return new Promise((resolve, reject) => {
        transporter = nodemailer_1.default.createTransport(new mandrill_nodemailer_transport_1.MandrillTransport({
            apiKey: process.env.MANDRILL_API_KEY
        }));
        resolve(transporter);
    });
}
async function send(emailFrom, emailTo, subject, attachments, globalMergeVars, mergeVars, templateSlug) {
    if (typeof transporter === 'undefined') {
        transporter = await createTransporter();
    }
    return new Promise((resolve, reject) => {
        let options = {
            from: emailFrom,
            to: emailTo,
            subject: subject,
            mandrillOptions: {
                template_name: templateSlug,
                template_content: [],
                message: {
                    global_merge_vars: globalMergeVars,
                    merge_vars: mergeVars,
                    attachments: attachments
                }
            }
        };
        transporter.sendMail(options, (error, info) => {
            if (error) {
                return reject(error);
            }
            return resolve(info);
        });
    });
}
exports.send = send;
//# sourceMappingURL=mailer.js.map
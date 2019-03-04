"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mandrill_nodemailer_transport_1 = require("mandrill-nodemailer-transport");
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter;
async function createTransporter() {
    return nodemailer_1.default.createTransport(new mandrill_nodemailer_transport_1.MandrillTransport({
        apiKey: process.env.MANDRILL_API_KEY
    }));
}
async function send(emailFrom, emailTo, subject, attachments, globalMergeVars, mergeVars, templateSlug) {
    if (typeof transporter === 'undefined') {
        transporter = await createTransporter();
    }
    const options = {
        from: emailFrom,
        to: emailTo,
        subject,
        mandrillOptions: {
            template_name: templateSlug,
            message: {
                global_merge_vars: globalMergeVars,
                merge_vars: mergeVars,
                attachments
            }
        }
    };
    transporter.sendMail(options, (error, info) => {
        if (error) {
            return Promise.reject(error);
        }
        return Promise.resolve(info);
    });
}
exports.send = send;
//# sourceMappingURL=mailer.js.map
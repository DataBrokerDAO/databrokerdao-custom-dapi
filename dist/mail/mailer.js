"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = require("@sendgrid/mail");
async function sendUpdate(from, to, subject, templateId, dynamicTemplateData, attachments) {
    const msg = {
        to,
        from,
        subject,
        templateId,
        dynamic_template_data: dynamicTemplateData,
        attachments
    };
    console.log(`Mail send to ${from}`);
    try {
        await mail_1.send(msg);
    }
    catch (error) {
        throw error;
    }
}
exports.sendUpdate = sendUpdate;
async function sendPurchased(from, to, subject, templateId, dynamicTemplateData) {
    const msg = {
        to,
        from,
        subject,
        templateId,
        dynamic_template_data: dynamicTemplateData
    };
    console.log(`Mail send to ${from}`);
    try {
        await mail_1.send(msg);
    }
    catch (error) {
        throw error;
    }
}
exports.sendPurchased = sendPurchased;
//# sourceMappingURL=mailer.js.map
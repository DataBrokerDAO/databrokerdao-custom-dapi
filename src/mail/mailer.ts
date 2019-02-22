import nodemailer from 'nodemailer';
import mandrillTransport = require('nodemailer-mandrill-transport');

require('dotenv').config();

let transporter;
function createTransporter() {
  return new Promise((resolve, reject) => {
    transporter = nodemailer.createTransport(
      mandrillTransport({
        auth: {
          apiKey: process.env.MANDRILL_API_KEY
        }
      })
    );
    resolve(transporter);
  });
}

export async function send(
  emailFrom,
  emailTo,
  subject,
  attachments,
  globalMergeVars,
  mergeVars,
  templateSlug
) {
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
        template_content: [], // Necessary for Mandrill legacy
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

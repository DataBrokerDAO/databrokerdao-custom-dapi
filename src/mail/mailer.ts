import nodemailer from 'nodemailer';
import { MandrillTransport } from 'mandrill-nodemailer-transport';
import { Attachment } from 'nodemailer/lib/mailer';
import { IGlobalMergeVar, IMergeVar } from '../types';
import { Mail } from '';

require('dotenv').config();

let transporter: Mail;
function createTransporter() {
  return new Promise((resolve, reject) => {
    transporter = nodemailer.createTransport(
      new MandrillTransport({
        apiKey: process.env.MANDRILL_API_KEY
      })
    );
    resolve(transporter);
  });
}

export async function send(
  emailFrom: string,
  emailTo: string,
  subject: string,
  attachments: Attachment[],
  globalMergeVars: IGlobalMergeVar[],
  mergeVars: IMergeVar[],
  templateSlug: string
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

    transporter.sendMail(options, (error: Error, info) => {
      if (error) {
        return reject(error);
      }
      return resolve(info);
    });
  });
}

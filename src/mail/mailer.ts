import { MandrillTransport } from 'mandrill-nodemailer-transport';
import nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { IGlobalMergeVar, IMergeVar } from '../types';

let transporter: nodemailer.Transporter;
async function createTransporter() {
  return nodemailer.createTransport(
    new MandrillTransport({
      apiKey: process.env.MANDRILL_API_KEY
    })
  );
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

  transporter.sendMail(options, (error: Error, info) => {
    if (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(info);
  });
}

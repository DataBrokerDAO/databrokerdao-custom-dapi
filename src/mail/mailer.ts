import {
  send as sendGridSend,
  sendMultiple as sendGridSendMultiple
} from '@sendgrid/mail';

import { AttachmentData } from '@sendgrid/helpers/classes/attachment';

import { MandrillTransport } from 'mandrill-nodemailer-transport';
import nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { ITemplateData } from '../types';

export async function send(
  from: string,
  to: string,
  subject: string,
  templateId: string,
  dynamicTemplateData: ITemplateData,
  attachments: AttachmentData[]
) {
  const msg = {
    to,
    from,
    subject,
    templateId,
    dynamic_template_data: dynamicTemplateData,
    attachments
  };
  try {
    console.log('Succesfull till here!');
    await sendGridSend(msg);
    console.log('Wooow');
  } catch (error) {
    throw error;
  }
}

// let transporter: nodemailer.Transporter;
// async function createTransporter() {
//   return nodemailer.createTransport(
//     new MandrillTransport({
//       apiKey: process.env.MANDRILL_API_KEY
//     })
//   );
// }

// export async function send(
//   emailFrom: string,
//   emailTo: string,
//   subject: string,
//   attachments: Attachment[],
//   globalMergeVars: IGlobalMergeVar[],
//   mergeVars: IMergeVar[],
//   templateSlug: string
// ) {
//   if (typeof transporter === 'undefined') {
//     transporter = await createTransporter();
//   }

//   const options = {
//     from: emailFrom,
//     to: emailTo,
//     subject,
//     mandrillOptions: {
//       template_name: templateSlug,
//       message: {
//         global_merge_vars: globalMergeVars,
//         merge_vars: mergeVars,
//         attachments
//       }
//     }
//   };

//   transporter.sendMail(options, (error: Error, info) => {
//     if (error) {
//       return Promise.reject(error);
//     }
//     return Promise.resolve(info);
//   });
// }

import {
  send as sendGridSend,
  sendMultiple as sendGridSendMultiple
} from '@sendgrid/mail';

import { AttachmentData } from '@sendgrid/helpers/classes/attachment';
import { ITemplateData } from '../types/types';

export async function sendUpdate(
  from: string,
  to: string,
  subject: string,
  templateId: string,
  dynamicTemplateData: ITemplateData,
  attachments: AttachmentData[]
) {
  // TODO: Remove hardcodedreceiver
  const msg = {
    to: 'vitanick2048@gmail.com',
    from,
    subject,
    templateId,
    dynamic_template_data: dynamicTemplateData,
    attachments
  };
  // TODO: Remove this
  console.log(`Mail send to ${to}`);
  try {
    await sendGridSend(msg);
  } catch (error) {
    throw error;
  }
}

export async function sendPurchased(
  from: string,
  to: string,
  subject: string,
  templateId: string,
  dynamicTemplateData: ITemplateData
) {
  // TODO: Remove hardcodedreceiver
  const msg = {
    to: 'vitanick2048@gmail.com',
    from,
    subject,
    templateId,
    dynamic_template_data: dynamicTemplateData
  };
  // TODO: Remove this
  console.log(`Mail send to ${to}`);
  try {
    await sendGridSend(msg);
  } catch (error) {
    throw error;
  }
}

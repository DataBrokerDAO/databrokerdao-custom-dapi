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
  const msg = {
    to,
    from,
    subject,
    templateId,
    dynamic_template_data: dynamicTemplateData,
    attachments
  };

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
  const msg = {
    to,
    from,
    subject,
    templateId,
    dynamic_template_data: dynamicTemplateData
  };

  try {
    await sendGridSend(msg);
  } catch (error) {
    throw error;
  }
}

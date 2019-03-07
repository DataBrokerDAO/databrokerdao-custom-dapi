import {
  DELIMITER_HASH,
  MIDDLEWARE_URL,
  SENDGRID_FROM_EMAIL,
  SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE
} from '../config/dapi-config';
import { ISensor } from '../types';
import { sendUpdate } from './mailer';

export async function sendSensorUpdate(
  email: string,
  sensor: ISensor,
  sensorAddress: string
) {
  // TODO: re-enable on deployment
  // TODO: change harcoded email recepient
  const attachments = CreateSensorUpdateAttachment(sensor);
  console.log(`Mail would have been send to ${email}`);
  sendUpdate(
    SENDGRID_FROM_EMAIL,
    'vitanick2048@gmail.com',
    'Sensor update',
    SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE,
    {
      sensor_name: sensor.key,
      current_year: 2019,
      subject: 'Sensor update',
      sensor_unsubscribe_single: getUnsubscribeSingleUrl(
        email,
        sensor,
        sensorAddress
      ),
      sensor_unsubscribe_all: getUnsubscribeAllUrl(email)
    },
    attachments
  );
}

function CreateSensorUpdateAttachment(sensor: ISensor) {
  const data = JSON.stringify(sensor);
  const content = Buffer.from(data).toString('base64');
  const attachments = [
    {
      type: 'application/json',
      filename: 'sensorupdate.json',
      content
    }
  ];
  return attachments;
}

function getUnsubscribeSingleUrl(
  email: string,
  sensor: ISensor,
  sensorAddress: string
) {
  const unsubscribeHash = Buffer.from(
    `${email}${DELIMITER_HASH}${sensorAddress}`
  ).toString('base64');
  const unsubscribeUrl = `${MIDDLEWARE_URL}/unsubscribe?hash=${unsubscribeHash}`;
  return unsubscribeUrl;
}

function getUnsubscribeAllUrl(email: string) {
  const unsubscribeHash = Buffer.from(email).toString('base64');
  const unsubscribeUrl = `${MIDDLEWARE_URL}/unsubscribe?hash=${unsubscribeHash}`;
  return unsubscribeUrl;
}

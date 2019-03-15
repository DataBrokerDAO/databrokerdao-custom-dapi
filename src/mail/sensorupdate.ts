// tslint:disable-next-line:no-var-requires
require('dotenv').config();
import { DELIMITER_HASH } from '../config/dapi-config';
import ConfigService from '../services/ConfigService';
import { ISensor } from '../types';
import { sendUpdate } from './mailer';

const configService = ConfigService.init();

export async function sendSensorUpdate(
  email: string,
  sensor: ISensor,
  sensorAddress: string
) {
  const attachments = CreateSensorUpdateAttachment(sensor);
  sendUpdate(
    configService.getVariable('SENDGRID_FROM_EMAIL'),
    email,
    'Sensor update',
    configService.getVariable('SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE'),
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
  const unsubscribeUrl = `${configService.getVariable(
    'MIDDLEWARE_URL'
  )}/unsubscribe?hash=${unsubscribeHash}`;
  return unsubscribeUrl;
}

function getUnsubscribeAllUrl(email: string) {
  const unsubscribeHash = Buffer.from(email).toString('base64');
  const unsubscribeUrl = `${configService.getVariable(
    'MIDDLEWARE_URL'
  )}/unsubscribe?hash=${unsubscribeHash}`;
  return unsubscribeUrl;
}

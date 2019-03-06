import {
  SENDGRID_FROM_EMAIL,
  SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE,
  MIDDLEWARE_URL
} from '../../config/dapi-config';
import { ISensor } from '../../types';
import { send as sendEmail } from '../mailer';

export async function sendSensorUpdate(recepient: string, sensor: ISensor) {
  console.log('Email send!');
  // TODO: re-enable on deployment
  return;
  const attachments = CreateSensorUpdateAttachment(sensor);
  sendEmail(
    SENDGRID_FROM_EMAIL,
    recepient,
    'Sensor update',
    SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE,
    {
      sensor_name: sensor.key,
      current_year: 2019,
      subject: 'Sensor update'
    },
    attachments
  );
}

function CreateSensorUpdateAttachment(sensor: ISensor) {
  console.log('Sending mail to another account for now');

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

function buildUnsubscribeSingleURl(recepient: string, sensor: ISensor){
  return `${MIDDLEWARE_URL}/`
}

function buildUnsubscribeAllUrl(recepient:n)

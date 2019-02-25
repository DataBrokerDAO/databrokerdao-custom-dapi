import { Attachment } from 'nodemailer/lib/mailer';
import { Request, Response } from 'express';
import {
  getPurchasesForSensorKey,
  getSensorForSensorId
} from '../services/mongo/store';
import rp = require('request-promise');
import { send as sendSensorUpdate } from '../mail/mails/sensorupdate';

export async function sensorDataRoute(req: Request, res: Response) {
  console.log(`Received data for sensor ${req.params.sensorid}`);
  const sensorId = req.params.sensorid;
  const sensorJsonUrl = req.body.url;
  const sensorJsonData = req.body.data;

  console.log(sensorId);
  console.log(req);
  if (
    typeof sensorJsonUrl === 'undefined' &&
    typeof sensorJsonData === 'undefined'
  ) {
    return res.sendStatus(400);
  }

  // Return early if there are no purchases
  const sensor = await getSensorForSensorId(sensorId);
  console.log(sensor, sensorId);
  if (!sensor) {
    console.log(`Could not find sensor ${sensorId}, possible race condition`);
    return res.sendStatus(404);
  }

  const purchases = await getPurchasesForSensorKey(sensor.key);
  if (purchases.length === 0) {
    return res.sendStatus(200);
  }

  let attachments: Attachment[];
  if (typeof sensorJsonUrl !== 'undefined') {
    
    let data = await rp({ url: sensorCsvUrl });
    data = data.replace(/;/g, ','); // Change delimiter so mail clients can parse it;
    const content = Buffer.from(data).toString('base64');

    const regexp = /\/\/.*\/(.*.csv)/g;
    const match = regexp.exec(sensorCsvUrl);
    const filename = match[1];

    attachments = [
      {
        contentType: 'text/csv',
        filename: filename,
        content: content
      }
    ];
  } else if (typeof sensorJsonData !== 'undefined') {
    const data = JSON.stringify(sensorJsonUrl);
    const content = Buffer.from(data).toString('base64');
    attachments = [
      {
        contentType: 'text',
        filename: 'sensorupdate',
        content: content
      }
    ];
  }

  // TODO: re-enable
  // await sendSensorUpdate(sensor, attachments);
  // return res.sendStatus(200);
}

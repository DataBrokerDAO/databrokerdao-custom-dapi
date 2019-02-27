import { Attachment } from 'nodemailer/lib/mailer';
import { Request, Response } from 'express';
import {
  getPurchasesForSensorKey,
  getSensorForSensorId
} from '../services/mongo/store';
import rp = require('request-promise');
import { send as sendSensorUpdate } from '../mail/mails/sensorupdate';
import Axios from 'axios';
import { ISensor, IPurchase } from '../types';
import { date } from 'joi';

export async function sensorDataRoute(req: Request, res: Response) {
  console.log(`Received data for sensor ${req.params.sensorid}`);
  const sensorJsonUrl = req.body.url;
  const sensorJsonData = req.body.data;

  console.log(sensorJsonUrl, sensorJsonData);
  if (
    typeof sensorJsonUrl === 'undefined' &&
    typeof sensorJsonData === 'undefined'
  ) {
    return res.sendStatus(400);
  }

  // Return early if there are no purchases
  const sensor = await getSensorForSensorId(sensorId).catch(() => {
    res.sendStatus(500);
  });
  if (!sensor) {
    console.log(`Could not find sensor ${sensorId}, possible race condition`);
    return res.sendStatus(404);
  }

  // TODO: Remove any?
  const purchases: any = await getPurchasesForSensorKey(sensor.key).catch(
    () => {
      res.sendStatus(500);
    }
  );
  console.log(purchases);
  if (purchases.length === 0) {
    return res.sendStatus(200);
  }

  let attachments: Attachment[];
  console.log(
    typeof sensorJsonUrl,
    typeof sensorJsonUrl !== undefined,
    typeof sensorJsonUrl !== 'undefined'
  );
  if (typeof sensorJsonUrl !== 'undefined') {
    try {
      console.log('Attempting to fetch json data from the api');
      let axiosData = await Axios.get(sensorJsonUrl);
      const content = Buffer.from(axiosData.data).toString('base64');
      // TODO: switch to constants
      attachments = [
        {
          contentType: 'application/json',
          filename: 'sensors.json',
          content: content
        }
      ];
    } catch (error) {
      throw error;
    }

    //   let data = await rp({ url: sensorCsvUrl });
    //   data = data.replace(/;/g, ','); // Change delimiter so mail clients can parse it;
    //   const content = Buffer.from(data).toString('base64');

    //   const regexp = /\/\/.*\/(.*.csv)/g;
    //   const match = regexp.exec(sensorCsvUrl);
    //   const filename = match[1];
  } else if (typeof sensorJsonData !== 'undefined') {
    const data = JSON.stringify(sensorJsonData);
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

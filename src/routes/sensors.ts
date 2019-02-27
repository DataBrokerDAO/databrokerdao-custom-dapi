import Axios from 'axios';
import { Request, Response } from 'express';
import { Attachment } from 'nodemailer/lib/mailer';
import rp = require('request-promise');
import { authenticate } from '../dapi/auth';
import { getSensorKeyForSensorId } from '../dapi/registries';
import { send as sendSensorUpdate } from '../mail/mails/sensorupdate';
import {
  getPurchasesForSensorKey,
  getSensorForSensorId
} from '../services/mongo/store';
import { IPurchase, ISensor } from '../types';
import { transformSensorsToSensorsIdKeyPair } from '../util/transform';

export async function sensorDataRoute(req: Request, res: Response) {
  console.log(`Received data for sensor ${req.body.key}`);
  const sensorId = req.body.key;
  const sensor = req.body;
  console.log(sensor);
  if (typeof sensor.key === 'undefined') {
    return res.sendStatus(400);
  }

  const authToken = await authenticate();
  console.log(authToken);

  // TODO: change get sensor by ID by the endpoint given by PJ in slack
  // TODO: why do you need it? because you need to go from sensorid => sensor.key (which is the smart contract address)
  // Return early if there are no purchases
  const sensorKey = await getSensorKeyForSensorId(sensorId).catch(
    () => {
      res.sendStatus(500);
    }
  );
  console.log(sensorKey, 'Sensorkey');
  if (!sensor) {
    console.log(`Could not find sensor ${sensorId}, possible race condition`);
    return res.sendStatus(404);
  }

  // // TODO: fetch purchases from DAPI - instead of going to mongo, use the DAPI endpoint
  // const purchases: any = await getPurchasesForSensorKey(sensor.key).catch(
  //   () => {
  //     res.sendStatus(500);
  //   }
  // );
  // console.log(purchases);
  // if (purchases.length === 0) {
  //   return res.sendStatus(200);
  // }

  // // TODO: attachment now becomes the data packet sent through the request body
  // let attachments: Attachment[];
  // console.log(
  //   typeof sensorJsonUrl,
  //   typeof sensorJsonUrl !== undefined,
  //   typeof sensorJsonUrl !== 'undefined'
  // );
  // if (typeof sensorJsonUrl !== 'undefined') {
  //   try {
  //     console.log('Attempting to fetch json data from the api');
  //     const axiosData = await Axios.get(sensorJsonUrl);
  //     const content = Buffer.from(axiosData.data).toString('base64');
  //     // TODO: switch to constants
  //     attachments = [
  //       {
  //         contentType: 'application/json',
  //         filename: 'sensors.json',
  //         content
  //       }
  //     ];
  //   } catch (error) {
  //     throw error;
  //   }

  //   //   let data = await rp({ url: sensorCsvUrl });
  //   //   data = data.replace(/;/g, ','); // Change delimiter so mail clients can parse it;
  //   //   const content = Buffer.from(data).toString('base64');

  //   //   const regexp = /\/\/.*\/(.*.csv)/g;
  //   //   const match = regexp.exec(sensorCsvUrl);
  //   //   const filename = match[1];
  // } else if (typeof sensorJsonData !== 'undefined') {
  //   const data = JSON.stringify(sensorJsonData);
  //   const content = Buffer.from(data).toString('base64');
  //   attachments = [
  //     {
  //       contentType: 'text',
  //       filename: 'sensorupdate',
  //       content
  //     }
  //   ];
  // }

  // // TODO: re-enable
  // await sendSensorUpdate(sensor, attachments);
  // // return res.sendStatus(200);
}

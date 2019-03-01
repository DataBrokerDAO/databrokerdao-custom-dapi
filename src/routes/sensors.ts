import Axios from 'axios';
import { Request, Response } from 'express';
import { Attachment } from 'nodemailer/lib/mailer';
import { DATABROKER_DAPI_BASE_URL } from '../config/dapi-config';
import { authenticate } from '../dapi/auth';
import { getSensorPurchasesForSensorKey } from '../dapi/purchase';
import { getSensorKeyForSensorId } from '../dapi/registries';
import { send as sendSensorUpdate } from '../mail/mails/sensorupdate';
import { IPurchase, ISensor } from '../types';
import { transformSensorsToSensorsIdKeyPair } from '../util/transform';

export async function sensorDataRoute(req: Request, res: Response) {
  console.log(`Received data for sensor ${req.body.key}`);
  const sensorId = req.body.key;
  const sensor = req.body;
  if (typeof sensor.key === 'undefined') {
    return res.sendStatus(400);
  }

  await authenticate();

  // TODO: change get sensor by ID by the endpoint given by PJ in slack
  // TODO: why do you need it? because you need to go from sensorid => sensor.key (which is the smart contract address)
  // Return early if there are no purchases
  const sensorKey = await getSensorKeyForSensorId(sensorId);
  if (sensorKey === undefined) {
    return res.sendStatus(500);
  }
  console.log(sensorKey, 'Sensorkey');
  if (!sensor) {
    console.log(`Could not find sensor ${sensorId}, possible race condition`);
    return res.sendStatus(404);
  }

  // TODO: fetch purchases from DAPI - instead of going to mongo, use the DAPI endpoint
  const purchases = await getSensorPurchasesForSensorKey(sensorKey).catch(
    (error: never) => {
      return res.sendStatus(500);
    }
  );

  console.log(purchases);
  // TODO: fix error
  // if (purchases.length === 0) {
  //   return res.sendStatus(200);
  // }

  // TODO: attachment now becomes the data packet sent through the request body
  let attachments: Attachment[];

  const data = JSON.stringify(sensor);
  const content = Buffer.from(data).toString('base64');
  attachments = [
    {
      contentType: 'text',
      filename: 'sensorupdate',
      content
    }
  ];

  // TODO: re-enable
  await sendSensorUpdate(sensor, attachments);
  return res.sendStatus(200);
}

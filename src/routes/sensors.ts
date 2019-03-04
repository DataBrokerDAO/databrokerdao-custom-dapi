import Axios from 'axios';
import { Request, Response } from 'express';
import { Attachment } from 'nodemailer/lib/mailer';
import {
  SENDGRID_FROM_EMAIL,
  SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE
} from '../config/dapi-config';
import { authenticate } from '../dapi/auth';
import { getSensorPurchasesForSensorKey } from '../dapi/purchase';
import { getSensorAddressesForSensorId } from '../dapi/registries';
import { send as sendEmail } from '../mail/mailer';
// import { send as sendSensorUpdate } from '../mail/mails/sensorupdate';
import { IPurchase, ISensor } from '../types';
import { transformSensorsToSensorsIdKeyPair } from '../util/transform';

export async function sensorDataRoute(req: Request, res: Response) {
  try {
    console.log(`Received data for sensor ${req.body.key}`);
    const sensorId = req.body.key;
    const sensor = req.body;
    if (typeof sensor.key === 'undefined') {
      console.log('Error!');
      return res.sendStatus(400);
    }

    // TODO: change get sensor by ID by the endpoint given by PJ in slack
    // TODO: why do you need it? because you need to go from sensorid => sensor.key (which is the smart contract address)
    // Return early if there are no purchases
    const sensorAddresses = await getSensorAddressesForSensorId(sensorId);
    for (const sensorAddress of sensorAddresses) {
      if (!sensor) {
        console.log(
          `Could not find sensor ${sensorId}, possible race condition`
        );
        return res.sendStatus(404);
      }

      // TODO: fix sensor purchases any
      const purchases: any = await getSensorPurchasesForSensorKey(
        sensorAddress
      ).catch((error: never) => {
        return res.sendStatus(500);
      });
      if (purchases.length > 0) {
        console.log(purchases);
      }
      // TODO: fix error
      if (purchases.length === 0) {
        return res.sendStatus(200);
      }

      console.log(sensor, purchases.length);
      for (const purchase of purchases) {
        // TODO: switch to mail to purchase.email;

        console.log('Sending mail to another account for now');

        // TODO: attachment now becomes the data packet sent through the request body

        const data = JSON.stringify(sensor);
        const content = Buffer.from(data).toString('base64');
        const attachments = [
          {
            type: 'application/json',
            filename: 'sensorupdate.json',
            content
          }
        ];
        sendEmail(
          SENDGRID_FROM_EMAIL,
          'vitanick2048@gmail.com',
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
      // TODO: re-enable
      // await sendSensorUpdate(sensor, attachments);
      console.log(`${sensorId} succesfully executed!`);
      return res.sendStatus(200);
    }
  } catch (error) {
    console.error(error);
  }
}

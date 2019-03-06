import Axios from 'axios';
import { Request, Response } from 'express';
import { now } from 'moment';
import { Attachment } from 'nodemailer/lib/mailer';
import {
  SENDGRID_FROM_EMAIL,
  SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE
} from '../config/dapi-config';
import { authenticate } from '../dapi/auth';
import { getSensorPurchasesForSensorKey } from '../dapi/purchaseRegistry';
import { getSensorAddressesForSensorId } from '../dapi/sensorRegistry';
import { sendSensorUpdate } from '../mail/mails/sensorupdate';
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

    // Return early if there are no purchases
    const sensorAddresses = await getSensorAddressesForSensorId(sensorId);
    if (sensorAddresses === undefined || sensorAddresses === []) {
      return res.sendStatus(404);
    }
    console.log(sensorAddresses);
    for (const sensorAddress of sensorAddresses) {
      if (!sensor) {
        console.log(
          `Could not find sensor ${sensorId}, possible race condition`
        );
        return res.sendStatus(404);
      }

      // TODO: Is this allowed?
      const purchases: any = await getSensorPurchasesForSensorKey(
        sensorAddress
      ).catch((error: never) => {
        return res.sendStatus(500);
      });
      if (purchases !== undefined) {
        console.log(purchases);
        if (purchases.length > 0) {
          console.log(purchases);
        }
        if (purchases.length === 0) {
          return res.sendStatus(200);
        }
        for (const purchase of purchases) {
          console.log(
            'Sending mail to another account for now',
            purchase,
            isSubscriptionValid(purchase)
          );
          if (isSubscriptionValid(purchase) && isSubscribed) {
            await sendSensorUpdate('vitanick2048@gmail.com', sensor);
          }
        }
        console.log(`${sensorId} succesfully executed!`);
        return res.sendStatus(200);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function isSubscriptionValid(purchase: IPurchase) {
  const isSubscriptionStarted =
    purchase.startTime < Math.floor(Date.now() / 1000);
  const isSubscriptionNotEnded =
    Math.floor(Date.now() / 1000) < purchase.endTime;

  return isSubscriptionStarted && isSubscriptionNotEnded;
}
function isSubscribed(purchase: IPurchase) {

}

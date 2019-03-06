import { Request, Response } from 'express';
import { getSensorPurchasesForSensorKey } from '../dapi/purchaseRegistry';
import { getSensorAddressesForSensorId } from '../dapi/sensorRegistry';
import { sendSensorUpdate } from '../mail/sensorupdate';
import { IPurchase } from '../types';

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
    for (const sensorAddress of sensorAddresses) {
      if (!sensor) {
        console.log(
          `Could not find sensor ${sensorId}, possible race condition`
        );
        return res.sendStatus(404);
      }

      let purchases: IPurchase[];
      try {
        purchases = await getSensorPurchasesForSensorKey(sensorAddress);
      } catch (error) {
        return res.sendStatus(424); // Failed Dependency
      }

      if (purchases) {
        if (!purchases.length) {
          return res.sendStatus(200);
        }
        for (const purchase of purchases) {
          console.log(
            'Sending mail to another account for now',
            purchase,
            isSubscriptionValid(purchase)
          );
          console.log(sensor);
          // TODO: Remove true/false
          if (false || (isSubscriptionValid(purchase) && isSubscribed)) {
            await sendSensorUpdate(purchase.email, sensor);
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
  // TODO move mongo
}

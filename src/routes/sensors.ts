import { Request, Response } from 'express';
import { getSensorPurchasesForSensorKey } from '../dapi/purchaseRegistry';
import {
  getSensorAddressesForSensorId,
  getSensorIdByAddress
} from '../dapi/sensorRegistry';
import { sendSensorUpdate } from '../mail/sensorupdate';
import { getCollection } from '../services/mongo/client';
import { IPurchase, ISensor } from '../types';

export async function sensorDataRoute(req: Request, res: Response) {
  try {
    console.log(`Received data for sensor ${req.body.key}`);
    const sensorId = req.body.key;
    const sensor = req.body;
    if (typeof sensor.key === 'undefined') {
      return res.sendStatus(400);
    }
    let sensorAddresses: string[];

    // Return early if there are no purchases
    sensorAddresses = await getSensorAddressesForSensorId(sensorId);
    if (sensorAddresses !== undefined && sensorAddresses !== []) {
      for (const sensorAddress of sensorAddresses) {
        if (!sensor) {
          console.log(
            `Could not find sensor ${sensorId}, possible race condition`
          );
          return res.status(404).send(`Could not find sensor ${sensorId}`);
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
            if (isSubscriptionValid(purchase) && isSubscribed(purchase)) {
              await sendSensorUpdate(
                purchase.email,
                sensor,
                getSensorIdByAddress(sensorAddress)
              );
            }
          }
          console.log(`${sensorId} succesfully executed!`);
          return res.status(200);
        }
      }
      res.status(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(404).send(error);
  }
}

function isSubscriptionValid(purchase: IPurchase) {
  const isSubscriptionStarted =
    purchase.startTime < Math.floor(Date.now() / 1000);
  const isSubscriptionNotEnded =
    Math.floor(Date.now() / 1000) < purchase.endTime;

  return isSubscriptionStarted && isSubscriptionNotEnded;
}

async function isSubscribed(sensorPurchase: IPurchase) {
  const mailRegistry = await getCollection('mailregistry');
  const subscriptionDocument = await mailRegistry.findOne({
    email: sensorPurchase.email,
    status: 'subscribed',
    sensorid: sensorPurchase.sensor
  });
  return subscriptionDocument != null;
}

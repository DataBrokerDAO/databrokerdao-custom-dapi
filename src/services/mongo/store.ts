import { isEmail } from 'validator';
import { sendSensorPurchaseRegistered } from '../../dapi/purchaseRegistry';
import { getSensorIdByAddress } from '../../dapi/sensorRegistry';
import { IPurchase, IRawPurchase, ISubscriber } from '../../types';
import { getCollection } from './client';

export async function getMailSubscribersBySensor(
  purchaseKey: string
): Promise<ISubscriber[]> {
  const collection = await getCollection('mailRegistry');
  const purchases = await collection.find({ key: purchaseKey });
  return purchases.toArray();
}

export async function addNotSubscribedUsersToDb(purchaseDict: {
  [index: string]: IPurchase[];
}) {
  for (const sensorId of Object.keys(purchaseDict)) {
    const sensorPurchases = purchaseDict[sensorId];
    sensorPurchases.map(verifySubscription);
  }
}

async function verifySubscription(sensorPurchase: IRawPurchase) {
  const mailRegistry = await getCollection('mailregistry');
  if (isEmail(sensorPurchase.email)) {
    const subscriptionDocument = await mailRegistry.findOne({
      email: sensorPurchase.email,
      sensorid: getSensorIdByAddress(sensorPurchase.sensor.toLowerCase())
    });
    if (subscriptionDocument == null) {
      mailRegistry.insertOne({
        email: sensorPurchase.email,
        status: 'subscribed',
        sensorid: getSensorIdByAddress(
          sensorPurchase.sensor.toLowerCase()
        )
      });
      sendSensorPurchaseRegistered(sensorPurchase);
    }
  }
}

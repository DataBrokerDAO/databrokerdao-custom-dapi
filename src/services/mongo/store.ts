import { isEmail } from 'validator';
import { sendSensorPurchaseRegistered } from '../../dapi/purchaseRegistry';
import { IPurchase, IRawPurchase, ISubscriber } from '../../types/types';
import { getCollection } from './client';

export async function getMailSubscribersBySensor(
  purchaseKey: string
): Promise<ISubscriber[]> {
  try {
    const collection = await getCollection('mailRegistry');
    const purchases = await collection.find({ key: purchaseKey });
    return purchases.toArray();
  } catch (error) {
    throw error;
  }
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
      sensorid: sensorPurchase.sensor
    });
    if (subscriptionDocument == null) {
      mailRegistry.insertOne({
        email: sensorPurchase.email,
        status: 'subscribed',
        sensorid: sensorPurchase.sensor
      });
      sendSensorPurchaseRegistered(sensorPurchase);
    }
  }
}

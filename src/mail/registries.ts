import { getCollection } from '../services/mongo/client';

export async function subscribe(email: string, sensorid: string) {
  const collection = await getCollection('mailregistry');
  const subscription = {
    email: email,
    sensorid: sensorid,
    status: 'subscribed'
  };
  await collection.insert(subscription);
  return subscription;
}

export async function unsubscribe(email: string, sensorid: string) {
  const collection = await getCollection('mailregistry');
  if (sensorid) {
    await collection.updateOne(
      {
        email: email,
        status: 'subscribed',
        sensorid: sensorid
      },
      {
        $set: {
          status: 'unsubscribed'
        }
      }
    );
  } else {
    await collection.updateMany(
      {
        email: email
      },
      {
        $set: {
          status: 'unsubscribed'
        }
      }
    );
  }
}

export async function isSubscribed(email: string, sensorid: string) {
  const collection = await getCollection('mailregistry');
  const record = await collection.findOne({
    email: email,
    sensorid: sensorid,
    status: 'subscribed'
  });
  return typeof record !== 'undefined' && record !== null;
}

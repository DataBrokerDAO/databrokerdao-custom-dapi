import { getCollection } from '../services/mongo/client';

export async function subscribe(email: string, sensorid: string) {
  const collection = await getCollection('mailregistry');
  const subscription = {
    email,
    sensorid,
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
        email,
        status: 'subscribed',
        sensorid
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
        email
      },
      {
        $set: {
          status: 'unsubscribed'
        }
      }
    );
  }
}

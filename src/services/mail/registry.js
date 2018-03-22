const mongo = require('./../mongo/client');

require('dotenv').config();

async function subscribe(email, sensorid) {
  const collection = await mongo.getCollection('mailregistry');
  const subscription = {
    email: email,
    sensorid: sensorid,
    status: 'subscribed'
  };
  await collection.insert(subscription);
  return subscription;
}

async function unsubscribe(email, sensorid) {
  return new Promise(async (resolve, reject) => {
    const collection = await mongo.getCollection('mailregistry');
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
      resolve();
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
      resolve();
    }
  });
}

async function isSubscribed(email, sensorid) {
  const collection = await mongo.getCollection('mailregistry');
  const record = await collection.findOne({
    email: email,
    sensorid: sensorid,
    status: 'subscribed'
  });
  return typeof record !== 'undefined' && record !== null;
}

module.exports = {
  subscribe,
  unsubscribe,
  isSubscribed
};

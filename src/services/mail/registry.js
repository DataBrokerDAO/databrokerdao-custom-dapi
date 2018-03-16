const mongo = require('./../mongo/client');

require('dotenv').config();

async function subscribe(sensor, emailaddress) {
  const collection = await mongo.getCollection('mail-registry');
  const subscribtion = await collection.insert({
    emailaddress: emailaddress,
    sensorid: sensor.sensorid,
    status: 'subscribed'
  });
  return subscribtion;
}

async function unsubscribe(emailaddress, sensorid) {
  return new Promise(async (resolve, reject) => {
    let match = {
      emailaddress: emailaddress,
      status: 'subscribed'
    };

    if (sensorid) {
      match.sensorid = sensorid;
    }

    const collection = await mongo.getCollection('mail-registry');
    const record = await collection.updateOne(match, {
      $set: {
        status: 'unsubscribed'
      }
    });

    if (typeof record === 'undefined' || record === null) {
      reject(`Could not unsubscribe ${sensorid} for ${emailaddress}`);
    }

    return resolve();
  });
}

async function isSubscribed(emailaddress, sensorID) {
  const collection = await mongo.getCollection('mail-registry');
  const record = await collection.findOne({
    emailaddress: emailaddress,
    sensorid: sensorID,
    status: 'active'
  });
  return typeof record !== 'undefined' && record !== null;
}

module.exports = {
  subscribe,
  unsubscribe,
  isSubscribed
};

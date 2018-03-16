const mongo = require('./../mongo/client');
const sensorregister = require('./mails/sensorregister');

require('dotenv').config();

async function watch() {
  const db = await mongo.getDb();
  const collection = await db.collection('purchaseregistry-items');

  collection.watch().on('change', async data => {
    if (data.operationType === 'insert') {
      const purchase = data.fullDocument;
      const streamregistry = await db.collection('streamregistry-items');
      const sensor = await streamregistry.findOne({ key: purchase.stream });

      subscribe(sensor, purchase.email);
      register(sensor, purchase.email);
    }
  });
}

async function subscribe(sensor, emailaddress) {
  const collection = await mongo.getCollection('mail-registry');
  await collection.insert({
    emailaddress: emailaddress,
    sensorid: sensor.sensorid,
    status: 'subscribed'
  });
}

async function register(sensor, emailaddress) {
  await sensorregister.send(sensor, emailaddress);
}

async function unsubscribe(unsubscribeHash) {
  return new Promise(async (resolve, reject) => {
    const hash = new Buffer(unsubscribeHash, 'base64').toString('utf8');
    const parts = hash.split(DELIMITER);

    // TODO validate user input here, might be injecting stuff through the hash
    let match = {
      emailaddress: parts[0],
      status: 'subscribed'
    };

    if (typeof parts[1] !== 'undefined') {
      match.sensorid = parts[1];
    }

    const collection = await mongo.getCollection('mail-registry');
    const record = await collection.updateOne(match, {
      $set: {
        status: 'unsubscribed'
      }
    });

    return typeof record !== 'undefined' && record !== null;
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
  watch,
  unsubscribe,
  isSubscribed
};

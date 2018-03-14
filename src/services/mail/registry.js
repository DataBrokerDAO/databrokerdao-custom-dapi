const mongo = require('./../mongo/client');
const mailer = require('./mailer');

async function watch() {
  const db = await mongo.getDb();
  const collection = await db.collection('purchaseregistry-items');

  collection.watch().on('change', data => {
    console.log(`Change stream triggered`, data);
    let purchase = data.fullDocument;
    subscribe(data.fullDocument.email, data.fullDocument.sensorid);
  });
}

async function subscribe(emailaddress, sensorID) {
  const collection = await mongo.getCollection('mail-registry');
  const record = await collection.insertOne({
    emailaddress: emailaddress,
    sensorid: sensorID,
    status: 'subscribed'
  });
  return record;
}

async function unsubscribe(emailaddress, sensorID) {
  const collection = await mongo.getCollection('mail-registry');
  const record = await collection.updateOne(
    {
      emailaddress: emailaddress,
      sensorid: sensorID,
      status: 'subscribed'
    },
    {
      $set: {
        status: 'unsubscribed'
      }
    }
  );
  return typeof record !== 'undefined' && record !== null;
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

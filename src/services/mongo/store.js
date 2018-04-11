const client = require('../mongo/client');

async function watch(collectionName, handler) {
  const collection = await client.getCollection(collectionName);
  collection.watch().on('change', handler);
}

async function getSensorForKey(key) {
  let collection = await client.getCollection('sensorregistry-items');
  return collection.findOne({ key: key });
}

async function getSensorForSensorId(sensorid) {
  let collection = await client.getCollection('sensorregistry-items');
  return collection.findOne({ sensorid: sensorid });
}

async function getPurchasesForSensorKey(sensorKey) {
  let collection = await client.getCollection('purchaseregistry-items');
  let purchases = await collection.find({ sensor: sensorKey });
  return purchases.toArray();
}

module.exports = {
  watch,
  getSensorForKey,
  getSensorForSensorId,
  getPurchasesForSensorKey
};

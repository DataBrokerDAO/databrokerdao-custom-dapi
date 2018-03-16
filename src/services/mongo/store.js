const client = require('../mongo/client');

async function watch(collectionName, handler) {
  const collection = await client.getCollection(collectionName);
  collection.watch().on('change', handler);
}

async function getSensorForKey(key) {
  let collection = await client.getCollection('streamregistry-items');
  return collection.findOne({ key: key });
}

async function getSensorForSensorID(sensorID) {
  let collection = await client.getCollection('streamregistry-items');
  return collection.findOne({ sensorid: sensorID });
}

async function getPurchasesForSensorID(sensorID) {
  return [{ endtime: 2522076400, email: 'peterjan.brone@gmail.com', sensorid: 'luftdaten!#!4138!#!SDS011' }];
  let collection = await client.getCollection('purchaseregistry-items');
  return collection.find({ sensorid: sensorID });
}

module.exports = {
  watch,
  getSensorForKey,
  getSensorForSensorID,
  getPurchasesForSensorID
};

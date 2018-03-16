const client = require('../mongo/client');

async function getSensorForSensorID(sensorID) {``
  let collection = await client.getCollection('streamregistry-items');
  return collection.findOne({ sensorid: sensorID });
}

async function getPurchasesForSensorID(sensorID) {
  return [{ endtime: 2522076400, email: 'peterjan.brone@gmail.com', sensorid: 'luftdaten!#!4138!#!SDS011' }];
  let collection = await client.getCollection('purchaseregistry-items');
  return collection.find({ sensorid: sensorID });
}

module.exports = {
  getSensorForSensorID,
  getPurchasesForSensorID
};

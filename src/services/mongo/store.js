const client = require('../mongo/client');

async function getPurchasesForSensorID(sensorID) {
  let collection = await client.getCollection('purchaseregistry-items');
  return collection.find({ sensorid: sensorID });
}

module.exports = {
  getPurchasesForSensorID
};

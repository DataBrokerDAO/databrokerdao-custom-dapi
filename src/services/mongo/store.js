const client = require('../mongo/client');

async function getPurchasesForSensorID(sensorID) {
  return [{endtime: 2522076400, address: '0x8155153b2d5372ccd895b899b8c8a51ae18e800db286fac44eb2e8bf52feca0f'}];
  let collection = await client.getCollection('purchaseregistry-items');
  return collection.find({ sensorid: sensorID });
}

async function triggerConnection() {
  return client.getCollection('purchaseregistry-items');
}

module.exports = {
  getPurchasesForSensorID,
  triggerConnection
};

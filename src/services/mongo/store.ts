import { getDbCollection } from './client';

export async function watch(collectionName: string, handler) {
  const collection = await getDbCollection(collectionName);
  collection.watch().on('change', handler);
}

export async function getSensorForKey(key: string) {
  let collection = await getDbCollection('sensorregistry-items');
  return collection.findOne({ key: key });
}

export async function getSensorForSensorId(sensorid: string) {
  let collection = await getDbCollection('sensorregistry-items');
  return collection.findOne({ sensorid: sensorid });
}

export async function getPurchasesForSensorKey(sensorKey: string) {
  let collection = await getDbCollection('purchaseregistry-items');
  let purchases = await collection.find({ sensor: sensorKey });
  return purchases.toArray();
}

export async function getPurchasesForPurchaseKey(purchaseKey: string) {
  let collection = await getDbCollection('purchaseregistry-items');
  let purchases = await collection.find({ key: purchaseKey });
  return purchases.toArray();
}

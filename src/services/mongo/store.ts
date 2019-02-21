import client = require('./client');
import { MongoClient } from 'mongodb';

async function watch(collectionName: string, handler) {
  const collection = await client.getCollection(collectionName);
  collection.watch().on('change', handler);
}

async function getSensorForKey(key: string) {
  let collection = await client.getCollection('sensorregistry-items');
  return collection.findOne({ key: key });
}

async function getSensorForSensorId(sensorid: string) {
  let collection = await client.getCollection('sensorregistry-items');
  return collection.findOne({ sensorid: sensorid });
}

async function getPurchasesForSensorKey(sensorKey: string) {
  let collection = await client.getCollection('purchaseregistry-items');
  let purchases = await collection.find({ sensor: sensorKey });
  return purchases.toArray();
}

async function getPurchasesForPurchaseKey(purchaseKey: string) {
  let collection = await client.getCollection('purchaseregistry-items');
  let purchases = await collection.find({ key: purchaseKey });
  return purchases.toArray();
}

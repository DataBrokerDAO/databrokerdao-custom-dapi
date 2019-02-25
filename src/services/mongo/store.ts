import { getCollection } from './client';
import { IPurchase, ISensor } from '../../types';

export async function watch(
  collectionName: string,
  handler: (...args: any[]) => void
) {
  try {
    const collection = await getCollection(collectionName);
    collection.watch().on('change', handler);
  } catch (error) {
    throw error;
  }
}

export async function getSensorForKey(key: string): Promise<ISensor> {
  try {
    let collection = await getCollection('sensorregistry-items');
    return collection.findOne({ key: key });
  } catch (error) {
    throw error;
  }
}

export async function getSensorForSensorId(sensorid: string): Promise<ISensor> {
  try {
    let collection = await getCollection('sensorregistry-items');
    return collection.findOne({ sensorid: sensorid });
  } catch (error) {
    throw error;
  }
}

export async function getPurchasesForSensorKey(
  sensorKey: string
): Promise<IPurchase[]> {
  try {
    let collection = await getCollection('purchaseregistry-items');
    let purchases = await collection.find({ sensor: sensorKey });
    return purchases.toArray();
  } catch (error) {
    throw error;
  }
}

export async function getPurchasesForPurchaseKey(
  purchaseKey: string
): Promise<IPurchase[]> {
  try {
    let collection = await getCollection('purchaseregistry-items');
    let purchases = await collection.find({ key: purchaseKey });
    return purchases.toArray();
  } catch (error) {
    throw error;
  }
}

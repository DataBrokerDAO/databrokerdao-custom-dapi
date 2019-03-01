import { IPurchase, ISensor } from '../../types';
import { getCollection } from './client';

// TODO: remove
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
    const collection = await getCollection('sensorregistry-items');
    return collection.findOne({ key });
  } catch (error) {
    throw error;
  }
}

export async function getSensorForSensorId(sensorid: string): Promise<ISensor> {
  try {
    const collection = await getCollection('sensorregistry-items');
    return collection.findOne({ sensorid });
  } catch (error) {
    throw error;
  }
}

export async function getPurchasesForSensorKey(
  sensorKey: string
): Promise<IPurchase[]> {
  try {
    const collection = await getCollection('purchaseregistry-items');
    const purchases = await collection.find({ sensor: sensorKey });
    return purchases.toArray();
  } catch (error) {
    throw error;
  }
}

export async function getPurchasesForPurchaseKey(
  purchaseKey: string
): Promise<IPurchase[]> {
  try {
    const collection = await getCollection('purchaseregistry-items');
    const purchases = await collection.find({ key: purchaseKey });
    return purchases.toArray();
  } catch (error) {
    throw error;
  }
}

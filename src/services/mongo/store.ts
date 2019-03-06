import { ISubscriber } from '../../types';
import { getCollection } from './client';

export async function getMailSubscribersBySensor(
  purchaseKey: string
): Promise<ISubscriber[]> {
  try {
    const collection = await getCollection('mailRegistry');
    const purchases = await collection.find({ key: purchaseKey });
    return purchases.toArray();
  } catch (error) {
    throw error;
  }
}

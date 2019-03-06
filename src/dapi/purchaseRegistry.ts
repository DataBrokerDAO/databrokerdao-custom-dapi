import axios from 'axios';
import { IPurchase, IRawPurchase } from '../types';
import { transformSensorPurchasesToSensorKeyPurchases } from '../util/transform';

let purchaseDictionary: { [index: string]: IPurchase[] } = {};

export async function updateSensorPurchases() {
  const sensorPurchases = await getSensorPurchases();

  purchaseDictionary = transformSensorPurchasesToSensorKeyPurchases(
    sensorPurchases
  );
}

async function getSensorPurchases() {
  try {
    console.log('Fetching sensorpurchases');
    const response = await axios.get(`/purchaseregistry/list?abi=false`);
    console.log('Finished fetching sensorpurchases');
    return response.data.items;
  } catch (error) {
    throw error;
  }
}

export async function getSensorPurchasesForSensorKey(sensorId: string) {
  console.log(`Fetching sensorpurchase for ${sensorId}`);

  if (purchaseDictionary[sensorId] === undefined) {
    const purchases: IRawPurchase[] = await querySensorPurchasesForSensorKey(
      sensorId
    );
    purchaseDictionary[sensorId] = [];
    purchaseDictionary = await transformSensorPurchasesToSensorKeyPurchases(
      purchases
    );
  }
  return purchaseDictionary[sensorId];
}

export async function querySensorPurchasesForSensorKey(sensorId: string) {
  try {
    const response = await axios.get(buildSensorKeyUrl(sensorId));
    return response.data.items;
  } catch (error) {
    throw error;
  }
}

function buildSensorKeyUrl(sensorId: string) {
  return `/purchaseregistry/list?abi=false&item.sensor=~${sensorId}`;
}

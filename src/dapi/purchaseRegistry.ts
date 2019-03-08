import axios from 'axios';
import {
  SENDGRID_FROM_EMAIL,
  SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS
} from '../config/dapi-config';
import { sendPurchased } from '../mail/mailer';
import { addNotSubscribedUsersToDb } from '../services/mongo/store';
import { IPurchase, IRawPurchase, ISubscriber } from '../types/types';
import {
  transformSensorPurchasesToSensorKeyPurchasesDict,
  transformSensorPurchasesToSensorPurchasesArray
} from '../util/transform';
import { getSensorIdByAddress } from './sensorRegistry';

let purchaseDictionary: { [index: string]: IPurchase[] } = {};
let purchaseCount = 0;

export async function updateSensorPurchases() {
  const data = await getSensorPurchases();
  if (purchaseCount < data.total) {
    const sensorPurchases = data.items;
    purchaseDictionary = transformSensorPurchasesToSensorKeyPurchasesDict(
      sensorPurchases
    );
    purchaseCount = data.total;
    addNotSubscribedUsersToDb(purchaseDictionary);
  }
}

async function getSensorPurchases() {
  try {
    const response = await axios.get(
      `/purchaseregistry/list?abi=false&skip=${purchaseCount}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// TODO: Remove?
// export async function getSensorPurchasesForSensorKey(sensorId: string) {
//   console.log(`Fetching sensorpurchase for ${sensorId}`);

//   if (purchaseDictionary[sensorId] === undefined) {
//     const purchases: IRawPurchase[] = await querySensorPurchasesForSensorKey(
//       sensorId
//     );
//     purchaseDictionary[sensorId] = [];
//     purchaseDictionary = await transformSensorPurchasesToSensorKeyPurchasesDict(
//       purchases
//     );
//   }
//   addNotSubscribedUsersToDb(purchaseDictionary);
//   return purchaseDictionary[sensorId];
// }

export async function getSensorPurchasesForSensorKey(sensorId: string) {
  try {
    const response = await axios.get(buildSensorKeyUrl(sensorId));
    const purchases: IRawPurchase[] = response.data.items;
    const newPurchases = transformSensorPurchasesToSensorPurchasesArray(
      purchases
    );
    return newPurchases;
  } catch (error) {
    throw error;
  }
}

function buildSensorKeyUrl(sensorId: string) {
  return `/purchaseregistry/list?abi=false&item.sensor=~${sensorId}`;
}

export async function sendSensorPurchaseRegistered(
  sensorPurchase: IRawPurchase
) {
  sendPurchased(
    SENDGRID_FROM_EMAIL,
    sensorPurchase.email,
    'Sensor update',
    SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS,
    {
      sensor_name: getSensorIdByAddress(sensorPurchase.sensor),
      current_year: 2019,
      subject: 'Sensor update'
    }
  );
}

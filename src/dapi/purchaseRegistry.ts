import axios from 'axios';
import {
  SENDGRID_FROM_EMAIL,
  SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS
} from '../config/dapi-config';
import { sendPurchased } from '../mail/mailer';
import { addNotSubscribedUsersToDb } from '../services/mongo/store';
import { IPurchase, IRawPurchase, ISubscriber } from '../types/types';
import { transformSensorPurchasesToSensorKeyPurchases } from '../util/transform';

let purchaseDictionary: { [index: string]: IPurchase[] } = {};

export async function updateSensorPurchases() {
  const sensorPurchases = await getSensorPurchases();
  purchaseDictionary = transformSensorPurchasesToSensorKeyPurchases(
    sensorPurchases
  );
  addNotSubscribedUsersToDb(purchaseDictionary);
}

async function getSensorPurchases() {
  try {
    const response = await axios.get(`/purchaseregistry/list?abi=false`);
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
  addNotSubscribedUsersToDb(purchaseDictionary);
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

export async function sendSensorPurchaseRegistered(
  sensorPurchase: IRawPurchase
) {
  sendPurchased(
    SENDGRID_FROM_EMAIL,
    sensorPurchase.email,
    'Sensor update',
    SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS,
    {
      sensor_name: sensorPurchase.sensor,
      current_year: 2019,
      subject: 'Sensor update'
    }
  );
}

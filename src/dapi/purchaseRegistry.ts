import axios from 'axios';
import { sendPurchased } from '../mail/mailer';
import ConfigService from '../services/ConfigService';
import { addNotSubscribedUsersToDb } from '../services/mongo/store';
import { IPurchase, IRawPurchase, ISubscriber } from '../types';
import {
  transformPurchasesToPurchasesArray,
  transformPurchasesToPurchasesDict
} from '../utils/transform';
import { getSensorIdByAddress } from './sensorRegistry';

const configService = ConfigService.init();

let purchaseDictionary: { [index: string]: IPurchase[] } = {};
let purchaseCount = 0;

export async function updateSensorPurchases() {
  const data = await getSensorPurchases();
  if (purchaseCount < data.total) {
    const sensorPurchases = data.items;
    purchaseDictionary = transformPurchasesToPurchasesDict(sensorPurchases);
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

export async function getSensorPurchasesForSensorKey(sensorId: string) {
  try {
    const response = await axios.get(buildSensorKeyUrl(sensorId));
    const purchases: IRawPurchase[] = response.data.items;
    const newPurchases = transformPurchasesToPurchasesArray(purchases);
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
    configService.getVariable('SENDGRID_FROM_EMAIL'),
    sensorPurchase.email,
    `You successfully purchased '${getSensorIdByAddress(
      sensorPurchase.sensor
    )}'`,
    configService.getVariable('SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS'),
    {
      sensor_name: getSensorIdByAddress(sensorPurchase.sensor),
      current_year: 2019,
      subject: 'Sensor update'
    }
  );
}

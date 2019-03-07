import axios from 'axios';
import { isEmail } from 'validator';
import {
  SENDGRID_FROM_EMAIL,
  SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS
} from '../config/dapi-config';
import { sendPurchased } from '../mail/mailer';
import { getCollection } from '../services/mongo/client';
import { IPurchase, IRawPurchase, ISubscriber } from '../types';
import { transformSensorPurchasesToSensorKeyPurchases } from '../util/transform';

let purchaseDictionary: { [index: string]: IPurchase[] } = {};

export async function updateSensorPurchases() {
  const sensorPurchases = await getSensorPurchases();
  console.log(sensorPurchases);
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

async function addNotSubscribedUsersToDb(purchaseDict: {
  [index: string]: IPurchase[];
}) {
  for (const sensorId of Object.keys(purchaseDict)) {
    const sensorPurchases = purchaseDict[sensorId];
    sensorPurchases.map(verifySubscription);
    console.log(sensorPurchases);
  }
}

async function verifySubscription(sensorPurchase: IRawPurchase) {
  const mailRegistry = await getCollection('mailregistry');
  console.log(sensorPurchase);
  if (isEmail(sensorPurchase.email)) {
    const subscriptionDocument = await mailRegistry.findOne({
      email: sensorPurchase.email,
      sensorid: sensorPurchase.sensor
    });
    if (subscriptionDocument == null) {
      mailRegistry.insertOne({
        email: sensorPurchase.email,
        status: 'subscribed',
        sensorid: sensorPurchase.sensor
      });
      sendSensorPurchaseRegisterd(sensorPurchase);
    }
  }
}

export async function sendSensorPurchaseRegisterd(
  sensorPurchase: IRawPurchase
) {
  // TODO: re-enable on deployment
  // TODO: change harcoded email recepient
  console.log(`Mail would have been send to ${sensorPurchase.email}`);
  sendPurchased(
    SENDGRID_FROM_EMAIL,
    'vitanick2048@gmail.com',
    'Sensor update',
    SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS,
    {
      sensor_name: sensorPurchase.sensor,
      current_year: 2019,
      subject: 'Sensor update'
    }
  );
}

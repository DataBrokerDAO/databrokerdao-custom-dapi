import axios from 'axios';
import { isEmail } from 'validator';
import { getCollection } from '../services/mongo/client';
import { IPurchase, IRawPurchase, ISubscriber } from '../types';
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

async function addNotSubscribedUsersToDb(purchaseDict: {
  [index: string]: IPurchase[];
}) {
  for (const sensorId of Object.keys(purchaseDict)) {
    const sensorPurchases = purchaseDict[sensorId];
    sensorPurchases.map(verifySubscription);
    console.log(sensorPurchases);
  }
}

async function verifySubscription(sensorPurchase: ISubscriber) {
  const mailRegistry = await getCollection('mailregistry');
  console.log(sensorPurchase);
  if (isEmail(sensorPurchase.email)) {
    const subscriptionDocument = await mailRegistry.findOne({
      email: sensorPurchase.email
    });
    if (subscriptionDocument == null) {
      mailRegistry.insertOne({
        email: sensorPurchase.email,
        blockedSensorSubscriptions: {},
        blockAllSensorSubscriptions: false
      });
    }
  }
}

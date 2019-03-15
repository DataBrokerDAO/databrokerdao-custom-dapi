import { IDapiSensor, IPurchase, IRawPurchase } from '../types';

export function transformSensorsToSensorsIdDict(sensors: IDapiSensor[]) {
  const sensorIdDict = {};
  for (const sensor of sensors) {
    sensorIdDict[sensor.sensorid] = sensor.contractAddress;
  }
  return sensorIdDict;
}

export function transformPurchasesToPurchasesDict(purchases: IRawPurchase[]) {
  const sensorPurchases = {};
  for (const sensorPurchase of purchases) {
    if (sensorPurchases[sensorPurchase.sensor] === undefined) {
      sensorPurchases[sensorPurchase.sensor] = [];
    }
    const newSensorPurchase = {
      startTime: sensorPurchase.startTime,
      email: sensorPurchase.email,
      endTime: sensorPurchase.endTime,
      sensor: sensorPurchase.sensor
    };
    sensorPurchases[sensorPurchase.sensor].push(newSensorPurchase);
  }
  return sensorPurchases;
}

export function transformPurchasesToPurchasesArray(purchases: IRawPurchase[]) {
  const newPurchases = [];
  for (const purchase of purchases) {
    const newPurchase: IPurchase = {
      sensor: purchase.sensor,
      email: purchase.email,
      startTime: purchase.startTime,
      endTime: purchase.endTime
    };
    newPurchases.push(newPurchase);
  }
  return newPurchases;
}

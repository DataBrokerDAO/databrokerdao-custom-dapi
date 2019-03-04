import { IDapiSensor, IPurchase } from '../types';

export function transformSensorsToSensorsIdKeyPair(sensors: IDapiSensor[]) {
  const sensorIdKeyPair = {};
  for (const sensor of sensors) {
    sensorIdKeyPair[sensor.sensorid] = sensor.contractAddress;
  }
  return sensorIdKeyPair;
}

export function transformSensorPurchasesToSensorKeyPurchases(
  purchases: IPurchase[]
) {
  const sensorPurchases = {};
  for (const sensorPurchase of purchases) {
    if (sensorPurchase[sensorPurchase.sensor] === undefined) {
      sensorPurchase[sensorPurchase.sensor] = [];
    }
    const newSensorPurchase = {
      email: sensorPurchase.email,
      endtime: sensorPurchase.endTime,
      sensor: sensorPurchase.sensor
    };

    sensorPurchase[sensorPurchase.sensor].push(newSensorPurchase);
  }
  return sensorPurchases;
}

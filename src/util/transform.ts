import { ISensor } from '../types';

export async function transformSensorsToSensorsIdKeyPair(sensors: ISensor[]) {
  const sensorIdKeyPair = {};
  for (const sensor of sensors) {
    sensorIdKeyPair[sensor.sensorid] = sensor.key;
  }
  console.log(sensorIdKeyPair);
  return sensorIdKeyPair;
}

import { IDapiSensor } from '../types';

export async function transformSensorsToSensorsIdKeyPair(
  sensors: IDapiSensor[]
) {
  const sensorIdKeyPair = {};
  for (const sensor of sensors) {
    sensorIdKeyPair[sensor.sensorid] = sensor.contractAddress;
  }
  return sensorIdKeyPair;
}

import axios from 'axios';
import { transformSensorsToSensorsIdKeyPair } from '../util/transform';

let sensorKeys: { [index: string]: string } = {};

export async function getSensorKeyForSensorId(sensorId: string) {
  const sensorKey = sensorKeys[sensorId]; // || (await querySensorKeyById(sensorId));
  console.log(sensorKey);
  return sensorKey;
}

export async function updateSensorKeys() {
  console.log('Updating sensorkeys');
  const sensors = await getSensors();
  sensorKeys = transformSensorsToSensorsIdKeyPair(sensors);
  console.log('Finished fetching sensorkeys');
}

async function querySensorKeyById(sensorId: string) {
  try {
    const response = await axios.get(buildSensorQueryUrl(sensorId));
    if (Array.isArray(response.data.items) && response.data.items.length > 0) {
      const sensor = response.data.items[0];
      sensorKeys[sensorId] = sensor.contractAddress;
      return sensor.contractAddress;
    } else {
      throw new Error('Sensor not found');
    }
  } catch (error) {
    throw error;
  }
}

async function getSensors() {
  try {
    const response = await axios.get(`/sensorregistry/list?abi=false`);
    return response.data.items;
  } catch (error) {
    throw error;
  }
}

function buildSensorQueryUrl(sensorId: string) {
  const encodedId = encodeURIComponent(sensorId);
  return `/sensorregistry/list?abi=false&item.sensorid=${encodedId}`;
}

import axios from 'axios';
import { transformSensorsToSensorsIdKeyPair } from '../util/transform';

let sensorKeys: { [index: string]: string } = {};

export async function getSensorKeyForSensorId(sensorId: string) {
  return sensorKeys[sensorId] || querySensorKeyById(sensorId);
}

export async function updateSensorKeys() {
  const sensors = await getSensors();
  const sensorAmount: any = {};

  sensorKeys = await transformSensorsToSensorsIdKeyPair(sensors);
}

async function querySensorKeyById(sensorId: string) {
  try {
    const response = await axios.get(buildSensorQueryUrl(sensorId));
    if (Array.isArray(response.data.items) && response.data.items.length > 0) {
      return response.data.items[0].contractAddress;
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

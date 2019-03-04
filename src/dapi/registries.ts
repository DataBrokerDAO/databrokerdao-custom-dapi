import axios from 'axios';
import set = require('lodash.set');
import { transformSensorsToSensorsIdKeyPair } from '../util/transform';

// tslint:disable-next-line:interface-over-type-literal
type Dict<T> = { [key: string]: T };
type Map = Dict<boolean>;

const sensorIdToAddress: Dict<Map> = {};

export async function getSensorAddressesForSensorId(
  sensorId: string
): Promise<string[]> {
  return sensorIdToAddress[sensorId]
    ? Object.keys(sensorIdToAddress[sensorId])
    : querySensorAddressById(sensorId);
}

export async function updateSensorAddresses() {
  console.log('Updating sensorkeys');
  const sensors = await getSensors();
  for (const sensor of sensors) {
    set(
      sensorIdToAddress,
      `${sensor.sensorid}.${sensor.contractAddress.toLowerCase()}`,
      true
    );
  }
  console.log('Finished fetching sensorkeys');
}

// TODO: Fix this so that id is correct when getting from sensors
async function querySensorAddressById(sensorId: string) {
  try {
    const response = await axios.get(buildSensorQueryUrl(sensorId));
    if (Array.isArray(response.data.items) && response.data.items.length > 0) {
      for (const sensor of response.data.items) {
        set(
          sensorIdToAddress,
          `${sensor.sensorid}.${sensor.contractAddress.toLowerCase()}`,
          true
        );
      }
      return Object.keys(sensorIdToAddress[sensorId]);
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

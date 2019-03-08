import axios from 'axios';
import set = require('lodash.set');

// tslint:disable-next-line:interface-over-type-literal
type Dict<T> = { [key: string]: T };
type Map = Dict<boolean>;

const sensorIdToAddress: Dict<Map> = {};
const sensorAddressToId: { [index: string]: string } = {};

export async function getSensorAddressesForSensorId(
  sensorId: string
): Promise<string[]> {
  const sensorAddress = sensorIdToAddress[sensorId]
    ? Object.keys(sensorIdToAddress[sensorId])
    : querySensorAddressById(sensorId);
  return sensorAddress;
}

export async function updateSensorAddresses() {
  const sensors = await getSensors();
  for (const sensor of sensors) {
    set(
      sensorIdToAddress,
      `${sensor.sensorid}.${sensor.contractAddress.toLowerCase()}`,
      true
    );
    sensorAddressToId[sensor.contractAddress.toLowerCase()] = sensor.sensorid;
  }
}

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
        sensorAddressToId[sensor.contractAddress.toLowerCase()] =
          sensor.sensorid;
      }
      return Object.keys(sensorIdToAddress[sensorId]);
    } else {
      throw new Error('Sensor not found');
    }
  } catch (error) {
    throw error;
  }
}

// This will already be stored by updateSensorAddresses or querySensorAddressById
export function getSensorIdByAddress(sensorAddress: string) {
  return sensorAddressToId[sensorAddress.toLocaleLowerCase()];
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

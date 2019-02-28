import { DATABROKER_DAPI_BASE_URL } from '../config/dapi-config';
import { transformSensorsToSensorsIdKeyPair } from '../util/transform';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';

let sensorKeys: { [index: string]: string } = {};

export async function getSensorKeyForSensorId(
  authtoken: string,
  sensorId: string
) {
  console.log(await querySensorKeyById(authtoken, sensorId));
  return (
    sensorKeys[sensorId] || (await querySensorKeyById(authtoken, sensorId))
  );
}

export async function updateSensorKeys(authToken: string) {
  const sensors = await getSensors(authToken);
  sensorKeys = await transformSensorsToSensorsIdKeyPair(sensors);
}

async function querySensorKeyById(authToken: string, sensorId: string) {
  try {
    const response = await axios.get(buildSensorQueryUrl(sensorId), {
      headers: { authorization: authToken }
    });
    if (Array.isArray(response.data.items) && response.data.items.length > 0) {
      return response.data.items[0].contractAddress;
    } else {
      throw 'Sensor not found';
    }
  } catch (error) {
    throw error;
  }
}

async function getSensors(authToken: string) {
  try {
    const response = await axios.get(
      `${DATABROKER_DAPI_BASE_URL}/sensorregistry/list?abi=false`,
      {
        headers: { authorization: authToken }
      }
    );
    return response.data.items;
  } catch (error) {
    throw error;
  }
}

function buildSensorQueryUrl(sensorId: string) {
  const encodedId = encodeURIComponent(sensorId);
  return `${DATABROKER_DAPI_BASE_URL}/sensorregistry/list?abi=false&item.sensorid=${encodedId}`;
}

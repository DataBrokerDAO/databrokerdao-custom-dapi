import rp = require('request-promise');
import { DATABROKER_DAPI_BASE_URL } from '../config/dapi-config';
import { transformSensorsToSensorsIdKeyPair } from '../util/transform';

let sensorKeys: { [index: string]: string } = {};

// TODO: Implement caching to avoid ddos issues on the server? Does this even work?
// export async function getSensorKeyForSensorId(
//   authToken: string,
//   sensorId: string
// ) {
//   try {
//     const response = await rp({
//       method: 'GET',
//       uri: buildSensorKeyUrl(sensorId),
//       body: {},
//       headers: { authorization: authToken },
//       json: true
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }

// function buildSensorKeyUrl(sensorId: string) {
//   return `${DATABROKER_DAPI_BASE_URL}/sensorregistry/list?abi=false&item.sensorid='${sensorId}`;
// }

export async function getSensorKeyForSensorId(sensorId: string) {
  return sensorKeys[sensorId];
}

export async function updateSensorKeys(authToken: string) {
  const sensors = await getSensors(authToken);
  sensorKeys = await transformSensorsToSensorsIdKeyPair(sensors);
}

async function getSensors(authToken: string) {
  try {
    const response = await rp({
      method: 'GET',
      uri: `${DATABROKER_DAPI_BASE_URL}/sensorregistry/list?abi=false`,
      body: {},
      headers: { authorization: authToken },
      json: true
    });
    return response.items;
  } catch (error) {
    throw error;
  }
}

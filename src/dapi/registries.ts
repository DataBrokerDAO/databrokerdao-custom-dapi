import rp = require('request-promise');
import { DATABROKER_DAPI_BASE_URL } from '../config/dapi-config';

export async function getSensorKeyForSensorId(authToken: string, id: string) {
  const sensors = await getSensorRegistry(authToken);
  console.log(sensors);
}

async function getSensorRegistry(authToken: string) {
  try {
    const response = await rp({
      method: 'GET',
      uri: `${DATABROKER_DAPI_BASE_URL}/sensorregistry/list?abi=false`,
      body: {},
      headers: { authorization: authToken },
      json: true
    });
    return response;
  } catch (error) {
    console.log('Failed to fetch sensorregistry');
    throw error;
  }
}

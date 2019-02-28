import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { DATABROKER_DAPI_BASE_URL } from '../config/dapi-config';

// TODO: Implement caching to avoid ddos issues on the server?
export async function getSensorPurchasesForSensorKey(
  authToken: string,
  sensorId: string
) {
  try {
    const response = await axios.get(buildSensorKeyUrl(sensorId), {
      headers: { authorization: authToken }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

function buildSensorKeyUrl(sensorId: string) {
  return `${DATABROKER_DAPI_BASE_URL}/sensorregistry/list?abi=false&item.sensorid='${sensorId}`;
}

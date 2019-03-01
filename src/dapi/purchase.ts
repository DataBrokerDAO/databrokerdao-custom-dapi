import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

// TODO: Implement caching to avoid ddos issues on the server?
export async function getSensorPurchasesForSensorKey(sensorId: string) {
  try {
    const response = await axios.get(buildSensorKeyUrl(sensorId));
    return response.data;
  } catch (error) {
    throw error;
  }
}

function buildSensorKeyUrl(sensorId: string) {
  return `/purchaseregistry/list?abi=false&item.sensor=${sensorId}`;
}

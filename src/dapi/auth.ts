import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import {
  DATABROKER_DAPI_BASE_URL,
  DATABROKER_DAPI_PASSWORD,
  DATABROKER_DAPI_USERNAME
} from '../config/dapi-config';

let authToken: string;

export async function authenticate() {
  try {
    if (!authenticated()) {
      const response = await axios.post(
        `${DATABROKER_DAPI_BASE_URL}/v1/users/authenticate`,
        {
          username: DATABROKER_DAPI_USERNAME,
          password: DATABROKER_DAPI_PASSWORD
        }
      );
      authToken = response.data.jwtToken;
    }
    return authToken;
  } catch (error) {
    console.error('Failed to authenticate with error', error);
    throw error;
  }
}

function authenticated() {
  return typeof authToken !== 'undefined';
}

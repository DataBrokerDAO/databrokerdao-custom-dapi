import rp = require('request-promise');
import {
  DATABROKER_DAPI_BASE_URL,
  DATABROKER_DAPI_PASSWORD,
  DATABROKER_DAPI_USERNAME
} from '../config/dapi-config';

let authToken: string;

export async function authenticate() {
  try {
    if (!authenticated()) {
      const options = {
        method: 'POST',
        uri: `${DATABROKER_DAPI_BASE_URL}/accounts/authenticate`,
        body: {
          username: DATABROKER_DAPI_USERNAME,
          password: DATABROKER_DAPI_PASSWORD
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        json: true
      };

      const response = await rp(options);
      authToken = response.token;
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

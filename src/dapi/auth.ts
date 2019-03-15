import axios from 'axios';
import ConfigService from '../services/ConfigService';

let authToken: string;
const configService = ConfigService.init();

export async function authenticate() {
  try {
    if (!authenticated()) {
      const response = await axios.post(`/v1/users/authenticate`, {
        username: configService.getVariable('DATABROKER_DAPI_USERNAME'),
        password: configService.getVariable('DATABROKER_DAPI_PASSWORD')
      });
      authToken = response.data.jwtToken;
      axios.defaults.headers.common.Authorization = authToken;
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

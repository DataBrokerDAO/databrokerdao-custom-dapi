import dotenv from 'dotenv';
import rtrim from 'rtrim';

dotenv.load();

export const DELIMITER_HASH: string = '||';
export const DELIMITER_SENSOR: string = '!#!';

export const DATABROKER_DAPP_BASE_URL: string = rtrim(
  process.env.DATABROKER_DAPP_BASE_URL
);

export const MONGO_DB_URL: string = rtrim(process.env.MONGO_DB_URL);
export const MONGO_DB_NAME: string = process.env.MONGO_DB_NAME;
// export const MONGO_DB_SENSOR_COLLECTION: string =
//   process.env.MONGO_DB_SENSOR_COLLECTION;

export const MIDDLEWARE_URL: string = rtrim(process.env.MIDDLEWARE_URL);
export const MIDDLEWARE_PORT: number =
  parseInt(process.env.MIDDLEWARE_PORT, 10) || 3000;

export const MANDRILL_API_KEY: string = process.env.MIDDLEWARE_PORT;
export const MANDRILL_TEMPLATE_SLUG_SENSOR_UPDATE: string =
  process.env.MIDDLEWARE_PORT;
export const MANDRILL_TEMPLATE_SLUG_SENSOR_REGISTRATION: string =
  process.env.MIDDLEWARE_PORT;
export const MANDRILL_TEMPLATE_SLUG_DATASET_CREDENTIALS: string =
  process.env.MIDDLEWARE_PORT;

export const DATABROKER_DAPI_USERNAME: string =
  process.env.DATABROKER_DAPI_USERNAME;
export const DATABROKER_DAPI_PASSWORD: string =
  process.env.DATABROKER_DAPI_PASSWORD;

export const DATABROKER_DAPI_BASE_URL: string = rtrim(
  process.env.DATABROKER_DAPI_BASE_URL || 'https://d3v.databrokerdao.com',
  '/'
);

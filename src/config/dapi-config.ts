import dotenv from 'dotenv';
import rtrim from 'rtrim';

dotenv.load();

export const DELIMITER_HASH: string = '||';
export const DELIMITER_SENSOR: string = '!#!';

export const DATABROKER_DAPP_BASE_URL: string = rtrim(
  process.env.DATABROKER_DAPP_BASE_URL
);

export const DATABROKER_DAPI_USERNAME: string =
  process.env.DATABROKER_DAPI_USERNAME;
export const DATABROKER_DAPI_PASSWORD: string =
  process.env.DATABROKER_DAPI_PASSWORD;

export const DATABROKER_DAPI_BASE_URL: string = rtrim(
  process.env.DATABROKER_DAPI_BASE_URL || 'https://d3v.databrokerdao.com/dapi',
  '/'
);

export const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY;

export const SENDGRID_FROM_EMAIL: string = process.env.SENDGRID_FROM_EMAIL;

export const SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE: string =
  process.env.SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE;
export const SENDGRID_TEMPLATE_SLUG_SENSOR_REGISTRATION: string =
  process.env.SENDGRID_TEMPLATE_SLUG_SENSOR_REGISTRATION;
export const SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS: string =
  process.env.SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS;

export const MONGO_DB_URL: string = rtrim(process.env.MONGO_DB_URL);
export const MONGO_DB_NAME: string = process.env.MONGO_DB_NAME;

export const MIDDLEWARE_URL: string = rtrim(process.env.MIDDLEWARE_URL);
export const MIDDLEWARE_PORT: number =
  parseInt(process.env.MIDDLEWARE_PORT, 10) || 3000;

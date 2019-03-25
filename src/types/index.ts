export interface IAttachment {
  type: string;
  filename: string;
  content: string;
}

export interface ISensor {
  key: string;
  name: string;
  sensorid: string;
  value: number;
  value_type: string;
}

export interface IPurchase {
  startTime: number;
  endTime: number;
  sensor: string;
  email: string;
}

export interface IGlobalMergeVar {
  name: string;
  content: string;
}

export interface IMergeVar {
  rcpt: string;
  vars: IGlobalMergeVar[];
}

export interface IDapiSensor {
  contractAddress: string;
  sensorid: string;
}

export interface ITemplateData {
  sensor_name: string;
  current_year: number;
  subject: string;
  sensor_unsubscribe_single?: string;
  sensor_unsubscribe_all?: string;
}

export interface IRawPurchase {
  startTime: number;
  endTime: number;
  sensor: string;
  email: string;
}

export interface ISubscriber {
  email: string;
  sensorid: string;
  status: string;
}

export interface IEnvironmentValidators {
  name: string;
  validator: ((...args: any[]) => boolean) | RegExp;
}

export type EnvironmentVariable =
  | 'DATABROKER_DAPI_BASE_URL'
  | 'DATABROKER_DAPI_PASSWORD'
  | 'DATABROKER_DAPI_USERNAME'
  | 'DATABROKER_DAPP_BASE_URL'
  | 'MIDDLEWARE_PORT'
  | 'MIDDLEWARE_URL'
  | 'MONGO_DB_NAME'
  | 'MONGO_DB_URL'
  | 'NODE_ENV'
  | 'SENDGRID_API_KEY'
  | 'SENDGRID_FROM_EMAIL'
  | 'SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS'
  | 'SENDGRID_TEMPLATE_SLUG_SENSOR_REGISTRATION'
  | 'SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE';

export type Environment = { [K in EnvironmentVariable]: string };

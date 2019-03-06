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
}

export interface IRawPurchase {
  startTime: number;
  endTime: number;
  sensor: string;
  email: string;
}

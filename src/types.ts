export interface IAttachment {
  type: string;
  name: string;
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
  endtime: number;
}

export interface IGlobalMergeVar {
  name: string;
  content: string;
}

export interface IMergeVar {
  rcpt: string;
  vars: IGlobalMergeVar[];
}

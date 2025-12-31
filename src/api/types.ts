export interface IoBrokerStateResponse {
  val: any;
  ack: boolean;
  ts: number;
  lc: number;
  from: string;
}

export interface IoBrokerObjectResponse {
  _id: string;
  type: string;
  common: {
    name?: string;
    type?: string;
    role?: string;
    read?: boolean;
    write?: boolean;
    min?: number;
    max?: number;
    unit?: string;
    step?: number;
    def?: any;
    states?: Record<string, string>;
  };
  native?: any;
}

export interface IoBrokerSetResponse {
  id: string;
  value: any;
}

export interface IoBrokerBulkResponse {
  [key: string]: IoBrokerStateResponse;
}

export interface IoBrokerError {
  error: string;
  message?: string;
}

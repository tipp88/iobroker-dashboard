import axios, { type AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG, ENDPOINTS } from '../config/api.config';
import type { IoBrokerStateResponse, IoBrokerBulkResponse, IoBrokerObjectResponse } from './types';

class IoBrokerClient {
  private client: AxiosInstance;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private async handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      console.error('IoBroker API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('IoBroker Network Error: No response received');
    } else {
      console.error('IoBroker Request Error:', error.message);
    }
    throw error;
  }

  private async retry<T>(
    fn: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.retry(fn, retries - 1);
      }
      throw error;
    }
  }

  async getState(stateId: string): Promise<any> {
    return this.retry(async () => {
      const response = await this.client.get<IoBrokerStateResponse>(
        ENDPOINTS.getState(stateId)
      );
      return response.data.val;
    });
  }

  async setState(stateId: string, value: any): Promise<void> {
    return this.retry(async () => {
      const url = `${ENDPOINTS.setState(stateId)}?value=${encodeURIComponent(value)}`;
      await this.client.get(url);
    });
  }

  async getBulkStates(stateIds: string[]): Promise<Record<string, any>> {
    if (stateIds.length === 0) {
      return {};
    }

    return this.retry(async () => {
      const response = await this.client.get<IoBrokerBulkResponse>(
        ENDPOINTS.getBulk(stateIds)
      );

      const result: Record<string, any> = {};
      Object.entries(response.data).forEach(([key, value]) => {
        result[key] = value.val;
      });

      return result;
    });
  }

  async validateState(stateId: string): Promise<{ isValid: boolean; stateId: string; error?: string; value?: any }> {
    try {
      const value = await this.getState(stateId);
      return {
        isValid: true,
        stateId,
        value,
      };
    } catch (error) {
      return {
        isValid: false,
        stateId,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async validateMultipleStates(stateIds: string[]): Promise<Array<{ isValid: boolean; stateId: string; error?: string; value?: any }>> {
    return Promise.all(stateIds.map(id => this.validateState(id)));
  }

  async getObject(stateId: string): Promise<IoBrokerObjectResponse | null> {
    try {
      const response = await this.client.get<IoBrokerObjectResponse>(`/getObject/${stateId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get object for ${stateId}:`, error);
      return null;
    }
  }

  async getStateMetadata(stateId: string): Promise<{
    min?: number;
    max?: number;
    unit?: string;
    step?: number;
    type?: string;
  } | null> {
    const obj = await this.getObject(stateId);
    if (!obj || !obj.common) {
      return null;
    }

    return {
      min: obj.common.min,
      max: obj.common.max,
      unit: obj.common.unit,
      step: obj.common.step,
      type: obj.common.type,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/');
      return true;
    } catch {
      return false;
    }
  }
}

export const iobrokerClient = new IoBrokerClient();
export default iobrokerClient;

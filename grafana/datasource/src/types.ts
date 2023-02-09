import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  token: string;
  floorId: string;
  minValue: number;
  maxValue: number;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  floorId: 'ab0b04b7-9811-42be-aa53-9fe693ff8e75',
  token: '73852421-4688-4373-b39c-74bf1652faa7',
  minValue: 0,
  maxValue: 10,
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}

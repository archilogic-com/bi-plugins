import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { floorId, token } from '@grafana-common';

export interface MyQuery extends DataQuery {
  token: string;
  floorId: string;
  minValue: number;
  maxValue: number;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  floorId,
  token,
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

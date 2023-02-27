import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { floorId, token } from '@bi-plugin-utils';

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
  floorId?: string;
  token?: string;
}

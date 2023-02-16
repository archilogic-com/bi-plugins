import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  LoadingState,
  CircularDataFrame,
  FieldType,
} from '@grafana/data';
import { Observable, merge } from 'rxjs';

import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';
import { getNodeIdsFromScene, randomIntFromInterval } from './helpers/utils';

const DATA_INTERVAL_TIME = 2000;

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }
  async getSceneIds(floorId: string, token: string) {
    const sceneStructureData = await fetch(
      `https://api.archilogic.com/v2/floor/${floorId}/scene-structure?pubtoken=${token}`
    );
    const sceneStructure: any = await sceneStructureData.json();
    return getNodeIdsFromScene(sceneStructure.structure);
  }
  query(options: DataQueryRequest<MyQuery>) {
    const target = options.targets[0];
    const floorId = target.floorId || DEFAULT_QUERY.floorId || '';
    const token = target.token || DEFAULT_QUERY.token || '';
    const minValue = target.minValue || DEFAULT_QUERY.minValue;
    const maxValue = target.maxValue || DEFAULT_QUERY.maxValue;
    let ids: any = [];
    new Promise((resolve) => resolve(this.getSceneIds(floorId, token))).then((result) => {
      ids = result;
    });
    const streams = options.targets.map((target) => {
      return new Observable<DataQueryResponse>((subscriber) => {
        const frame = new CircularDataFrame({
          append: 'head',
          capacity: 20,
        });

        frame.refId = target.refId;
        frame.addField({ name: 'id', type: FieldType.string });
        frame.addField({ name: 'value', type: FieldType.number });

        const intervalId = setInterval(() => {
          if (!ids.length) {
            return;
          }
          const randomId = ids[Math.floor(Math.random() * ids.length)];
          frame.add({ id: randomId, value: randomIntFromInterval(minValue, maxValue) });

          subscriber.next({
            data: [frame],
            key: target.refId,
            state: LoadingState.Streaming,
          });
        }, DATA_INTERVAL_TIME);

        return () => {
          clearInterval(intervalId);
        };
      });
    });

    return merge(...streams);
  }

  async testDatasource() {
    return {
      status: 'success',
      message: 'Success',
    };
  }
}

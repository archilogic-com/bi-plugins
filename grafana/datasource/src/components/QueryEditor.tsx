import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onMinValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, minValue: Number(event.target.value) });
    onRunQuery();
  };

  onMaxValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, maxValue: Number(event.target.value) });
    onRunQuery();
  };

  onTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, token: event.target.value });
    onRunQuery();
  };

  onFloorIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, floorId: event.target.value });
    onRunQuery();
  };

  render() {
    const { minValue, maxValue, token, floorId } = this.props.query;

    return (
      <div className="gf-form">
        <div className="gf-form-group">
          <FormField labelWidth={8} value={floorId || ''} onChange={this.onFloorIdChange} label="Floor plan ID" />
          <FormField labelWidth={8} value={token || ''} onChange={this.onTokenChange} label="Publishable Token" />
        </div>
        <div className="gf-form-group">
          <FormField
            labelWidth={6}
            value={minValue || 0}
            typeof="number"
            onChange={this.onMinValue}
            label="Min value"
          />
          <FormField
            labelWidth={6}
            value={maxValue || 10}
            typeof="number"
            onChange={this.onMaxValue}
            label="Max value"
          />
        </div>
      </div>
    );
  }
}

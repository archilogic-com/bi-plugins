import React from 'react';
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk';
import { PanelProps } from '@grafana/data';
//@ts-ignore-next-line
import { FloorPlan, getAssetsAndSpaces, getNodeByid, hexToRgb } from '../../../../global';

import { getGradients } from '../helpers/colors';
import { FloorOptions } from 'types';

interface Props extends PanelProps<FloorOptions> {}

export const FloorPanel: React.FC<Props> = (props) => {
  const { id, token, nodeId, colorFrom, colorTo } = props.options;
  const { data } = props;
  const series: any = data?.series[0];
  const ids = series?.fields[0].values.buffer;
  const values = series?.fields[1].values.buffer;
  let floorPlan: FloorPlanEngine;

  const gradient = getGradients(colorFrom, colorTo);
  function handleInputSourceData() {
    const nodes = getAssetsAndSpaces(floorPlan);
    nodes.forEach((entity: any) => {
      if (ids.includes(entity.id)) {
        const colorValue = gradient[values[ids.indexOf(entity.id)]];
        const color = hexToRgb(colorValue);
        entity.node.setHighlight({ fill: color });
      } else {
        entity.node.setHighlight();
      }
    });
  }
  function highlightNode(node: any) {
    node?.setHighlight({ fill: [100, 200, 100] });
  }
  function handleSpaceId() {
    const node = getNodeByid(floorPlan, nodeId);
    if (node) {
      highlightNode(node);
    }
  }
  function handleEvents(fpe: FloorPlanEngine) {
    floorPlan = fpe;
    handleInputSourceData();
    handleSpaceId();
  }

  return <FloorPlan id={id} token={token} onLoad={handleEvents} />;
};

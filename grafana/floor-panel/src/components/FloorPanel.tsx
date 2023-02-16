import React from 'react'
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'
import { PanelProps } from '@grafana/data'

import { FloorPlan, getAssetsAndSpaces, getNodeByid, hexToRgb } from '@bi-plugin-utils'
import { getGradients, getSeries } from '@grafana-common'

import { FloorOptions } from '../types'

interface Props extends PanelProps<FloorOptions> {}
const HIGHLIGHT_COLOR: [number, number, number] = [100, 200, 100]

let floorPlan: FloorPlanEngine
let isFloorPlanLoaded = false

export const FloorPanel: React.FC<Props> = props => {
  const { id, token, nodeId, colorFrom, colorTo } = props.options
  const { data } = props
  const { ids, values } = getSeries(data)

  const gradient = getGradients(colorFrom, colorTo)

  function handleInputSourceData() {
    const nodes = getAssetsAndSpaces(floorPlan)
    nodes.forEach((entity: any) => {
      if (ids.includes(entity.id)) {
        const colorValue = gradient[values[ids.indexOf(entity.id)]]
        const color = hexToRgb(colorValue)
        entity.node.setHighlight({ fill: color })
      } else {
        entity.node.setHighlight()
      }
    })
  }
  function handleSpaceId() {
    const node = getNodeByid(floorPlan, nodeId)
    if (node) {
      node?.setHighlight({ fill: HIGHLIGHT_COLOR })
    }
  }
  function handleEvents(fpe: FloorPlanEngine) {
    isFloorPlanLoaded = true
    floorPlan = fpe
    handleInputSourceData()
    handleSpaceId()
  }

  return <FloorPlan id={id} token={token} loaded={isFloorPlanLoaded} onLoad={handleEvents} />
}

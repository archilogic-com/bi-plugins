import React, { useState, useEffect } from 'react'
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'

import {
  generateGradients,
  getAssetsAndSpaces,
  getSpaceByPosition,
  hexToRgb,
  getNodeById,
  FloorPlan
} from '../../../../utils'

interface FloorPanelProps {
  publishableToken: string
  floorID: string
  nodeIds?: any[]
  nodeValues?: any[]
  gradient?: any
  isGradient: any
  onClick: (categoryIndex: string) => void
}

export const FloorPanel = (props: FloorPanelProps) => {
  const [state, setState] = useState<{ selectedSpace: any; isFloorPlanLoaded: boolean; floorPlan: FloorPlanEngine }>({
    selectedSpace: null,
    isFloorPlanLoaded: false,
    floorPlan: null
  })

  const getGradientColorBySpaceValue = (space) => {
    const gradient = generateGradients(props.gradient.min.color, props.gradient.max.color)
    const valueIndex = props.nodeIds?.indexOf(space.id)
    const gradientIndex = Math.floor(props.nodeValues?.[valueIndex])
    if (valueIndex) {
      const rgb = gradient[valueIndex]
      return hexToRgb(rgb)
    }
  }

  const getHighlightColor = (space) => {
    if (props.isGradient.value && props.gradient?.min) {
      return getGradientColorBySpaceValue(space)
    }
  }

  const highlightNode = (space, fillOpacity = 1.0) => {
    if (!space) return
    const fillColor = getHighlightColor(space)
    space.node.setHighlight({
      fill: fillColor,
      fillOpacity
    })
  }

  const highlightNodes = (fillOpacity = 1.0) => {
    const nodes = getAssetsAndSpaces(state.floorPlan)
    nodes.forEach((space: any) => {
      highlightNode(space, fillOpacity)
    })
  }

  const highlightNodesFromProps = () => {
    highlightNodes(0.5)
    props.nodeIds.forEach(nodeId => {
      const space = getNodeById(state.floorPlan, nodeId)
      highlightNode(space)
    })
  }

  const handleClick = () => {
    state.floorPlan?.on('click', event => {
      const position: number[] = event.pos
      const selectedSpace = getSpaceByPosition(state.floorPlan, position)
      if (state.selectedSpace === selectedSpace) return
      setState(prevState => ({ ...prevState, selectedSpace }))
      if (!selectedSpace) return
      props.onClick(selectedSpace.id)
    })
  }

  const handleHighlightedNodes = () => {
    if (!state.isFloorPlanLoaded) return
    if (props.nodeIds.length) {
      highlightNodesFromProps()
    } else {
      highlightNodes()
    }
  }

  const handleLoad = (fpe: FloorPlanEngine) => {
    setState(prevState => ({
      ...prevState,
      isFloorPlanLoaded: true,
      floorPlan: fpe
    }))
    handleHighlightedNodes()
    handleClick()
  }

  useEffect(() => {
    handleHighlightedNodes()
  })

  return (
    <div id="app">
      <FloorPlan
        id={props.floorID}
        token={props.publishableToken}
        loaded={state.isFloorPlanLoaded}
        onLoad={handleLoad}
      />
    </div>
  )
}
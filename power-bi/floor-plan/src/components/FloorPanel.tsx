import React, { useState, useEffect } from 'react'
import { FloorPlanEngine } from './fpe.cjs.js'

import {
  generateGradients,
  getAssetsAndSpaces,
  getSpaceByPosition,
  hexToRgb,
  getNodeById,
  FloorPlan
} from '../../../../utils'

let floorPlan: FloorPlanEngine

interface FloorPanelProps {
  publishableToken: string
  floorID: string
  nodeIds?: any[]
  nodeValues?: any[]
  gradient?: any
  isGradient: any
  onClick: (categoryIndex: string) => void
}

const categoriesToHighlight = ['work', 'meet', 'socialize']

const defaultColors = {
  work: [19, 141, 255],
  meet: [18, 35, 159],
  socialize: [230, 108, 55],
  other: [255, 255, 255]
}

export const FloorPanel = (props: FloorPanelProps) => {
  const [state, setState] = useState<{ selectedSpace: any; isFloorPlanLoaded: boolean }>({
    selectedSpace: null,
    isFloorPlanLoaded: false
  })

  const getGradientColorBySpaceValue = (space) => {
    const gradient = generateGradients(props.gradient.min.color, props.gradient.max.color)
    const valueIndex = props.nodeIds?.indexOf(space.id)
    const gradientIndex = Math.floor(props.nodeValues?.[valueIndex] * 10)
    if (gradientIndex) {
      const rgb = gradient[gradientIndex]
      return hexToRgb(rgb)
    }
  }

  const getHighlightColor = (space) => {
    let color = defaultColors[space.program]
    if (props.isGradient.value && props.gradient.min) {
      const gradientColor = getGradientColorBySpaceValue(space)
      if (gradientColor) color = gradientColor
    }
    return color
  }

  const highlightNode = (space, fillOpacity = 1.0) => {
    if (!space) return
    if (categoriesToHighlight.includes(space.program)) {
      const fillColor = getHighlightColor(space)
      space.node.setHighlight({
        fill: fillColor,
        fillOpacity
      })
    }
  }

  const highlightNodes = (fillOpacity = 1.0) => {
    const nodes = getAssetsAndSpaces(floorPlan)
    nodes.forEach((space: any) => {
      highlightNode(space, fillOpacity)
    })
  }

  const highlightNodesFromProps = () => {
    highlightNodes(0.5)
    props.nodeIds.forEach(nodeId => {
      const space = getNodeById(floorPlan, nodeId)
      highlightNode(space)
    })
  }

  const handleClick = () => {
    floorPlan.on('click', event => {
      const position: number[] = event.pos
      const selectedSpace = getSpaceByPosition(floorPlan, position)
      if (state.selectedSpace === selectedSpace) return
      setState(prevState => ({ ...prevState, selectedSpace }))
      if (!selectedSpace || !categoriesToHighlight.includes(selectedSpace.program)) return
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
      isFloorPlanLoaded: true
    }))
    floorPlan = fpe
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
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
  setSelectedSpaceId: (categoryIndex: string) => void
  clearSelection?: () => void
}

export const FloorPanel = (props: FloorPanelProps) => {
  const [floorPlan, setFloorplan] = useState(null)
  const [isFloorPlanLoaded, setIsFloorPlanLoaded] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [colorMap, setColorMap] = useState<Map<string, number[]>>(new Map())

  const getGradientColorBySpaceValue = (space) => {
    const gradient = generateGradients(props.gradient.min.color, props.gradient.max.color)
    const valueIndex = props.nodeIds?.indexOf(space.id)
    if (valueIndex) {
      const rgb = gradient[valueIndex]
      return hexToRgb(rgb)
    }
  }

  const generateColorMap = (fpe: FloorPlanEngine) => {
    const map = new Map<string, number[]>()
    props.nodeIds.forEach(nodeId => {
      const space = getNodeById(fpe, nodeId)
      if (space) {
        const fillColor = getHighlightColor(space)
        map.set(space.id, fillColor)
      }
    })
    return map
  }

  const getHighlightColor = (space) => {
    if (props.isGradient.value && props.gradient?.min) {
      return getGradientColorBySpaceValue(space)
    }
  }

  const highlightNode = (space, fillOpacity = 1.0) => {
    if (!space) return
    const fillColor = colorMap.get(space.id) ?? getHighlightColor(space)
    space.node.setHighlight({
      fill: fillColor,
      fillOpacity
    })
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

  const handleHighlightedNodes = () => {
    if (props.nodeIds.length) {
      highlightNodesFromProps()
    } else {
      highlightNodes()
    }
  }

  const handleLoad = (fpe: FloorPlanEngine) => {
     setFloorplan(fpe)
     setIsFloorPlanLoaded(true)
     setColorMap(generateColorMap(fpe))
  }

  useEffect(() => {
    handleHighlightedNodes()
  }, [floorPlan, selectedSpace, props.nodeIds, colorMap])

  useEffect(() => {
    setColorMap(generateColorMap(floorPlan))
  }, [props.gradient])

  useEffect(() => {
    if (!floorPlan) return

    const handleClickEvent = event => {
      const position: number[] = event.pos
      const spaceByPosition = getSpaceByPosition(floorPlan, position)
      if (selectedSpace === spaceByPosition) { 
        return
      }
      setSelectedSpace(spaceByPosition)
      if (!spaceByPosition) {
        props.clearSelection()
        highlightNodes()
        return
      }
      props.setSelectedSpaceId(spaceByPosition.id)
    }

    floorPlan.on('click', handleClickEvent)
    
  }, [floorPlan, props.setSelectedSpaceId])

  return (
    <div id="app">
      <FloorPlan
        id={props.floorID}
        token={props.publishableToken}
        loaded={isFloorPlanLoaded}
        onLoad={handleLoad}
      />
    </div>
  )
}
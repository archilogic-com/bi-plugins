import React, { useState, useEffect } from 'react'
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'

import {
  getAssetsAndSpaces,
  getSpaceByPosition,
  getNodeById,
  FloorPlan,
  getGradientColorBySpaceValue
} from '../../../../utils'

interface FloorPanelProps {
  publishableToken: string
  floorID: string
  allDataEntries: Map<string, any>
  highlightedDataEntries: Map<string, any>
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

  const generateColorMap = (fpe: FloorPlanEngine) => {
    const map = new Map<string, number[]>()
    for (const nodeId of props.allDataEntries.keys()) {
      const space = getNodeById(fpe, nodeId)
      if (space) {
        const fillColor = getHighlightColor(space)
        map.set(space.id, fillColor)
      }
    }

    return map
  }

  const getHighlightColor = (space) => {
    if (props.isGradient.value && props.gradient?.min && props.gradient?.max) {
      return getGradientColorBySpaceValue(props.gradient.min?.color, props.gradient.max?.color, props.allDataEntries, space.id)
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
    for (const nodeId of props.highlightedDataEntries.keys()) {
      const space = getNodeById(floorPlan, nodeId)
      highlightNode(space)
    }
  }

  const highlightSelectedSpace = () => {
      highlightNodes(0.5)
      highlightNode(selectedSpace)
    }

  const handleHighlightedNodes = () => {
    if (props.highlightedDataEntries?.size > 0) {
      highlightNodesFromProps()
    } else if (selectedSpace) {
      highlightSelectedSpace()
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
    setIsFloorPlanLoaded(false)
  }, [props.floorID, props.publishableToken])

  useEffect(() => {
    handleHighlightedNodes()
  }, [floorPlan, selectedSpace, props.allDataEntries, props.highlightedDataEntries, colorMap, props.setSelectedSpaceId])

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
    
  }, [floorPlan, selectedSpace])

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
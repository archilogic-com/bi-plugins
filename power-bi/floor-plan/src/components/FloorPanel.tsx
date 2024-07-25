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
  const [floorPlan, setFloorplan] = useState(null)
  const [isFloorPlanLoaded, setIsFloorPlanLoaded] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState(null)

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
    if (!isFloorPlanLoaded) return
    if (props.nodeIds.length) {
      highlightNodesFromProps()
    } else {
      highlightNodes()
    }
  }

  const handleLoad = (fpe: FloorPlanEngine) => {
     handleHighlightedNodes()
     setFloorplan(fpe)
     setIsFloorPlanLoaded(true)
  }

  useEffect(() => {
    handleHighlightedNodes()
  })

  useEffect(() => {
    if (floorPlan) {
      const handleClickEvent = event => {
        const position: number[] = event.pos
        const spaceByPosition = getSpaceByPosition(floorPlan, position)
        if (selectedSpace === spaceByPosition) { 
          return
        }
        setSelectedSpace(spaceByPosition)
        if (!spaceByPosition) {
          return
        }
        props.onClick(spaceByPosition.id)
      }
  
      floorPlan.on('click', handleClickEvent)
  
      return () => {
        floorPlan.off('click', handleClickEvent)
      }
    }
  }, [floorPlan, props.onClick])

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
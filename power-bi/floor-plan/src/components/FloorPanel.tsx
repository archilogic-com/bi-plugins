import React from 'react'
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'

import {
  FloorPlan,
  generateGradients,
  getAssetsAndSpaces,
  getSpaceByPosition,
  hexToRgb,
  getNodeById
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

interface FloorPanelState {
  isFloorPlanLoaded: any
  selectedSpace: any
}

const categoriesToHighlight = ['work', 'meet', 'socialize']

const defaultColors = {
  work: [159, 188, 255],
  meet: [121, 204, 205],
  socialize: [241, 102, 100],
  other: [255, 255, 255]
}

export class FloorPanel extends React.Component<FloorPanelProps, FloorPanelState> {
  constructor(props) {
    super(props)
    this.state = { selectedSpace: null, isFloorPlanLoaded: false } as FloorPanelState
  }
  getGradientColorBySpaceValue(space) {
    const gradient = generateGradients(this.props.gradient.min.color, this.props.gradient.max.color)
    const valueIndex = this.props.nodeIds?.indexOf(space.id)
    const gradientIndex = Math.floor(this.props.nodeValues?.[valueIndex] * 10)
    if (gradientIndex) {
      const rgb = gradient[gradientIndex]
      return hexToRgb(rgb)
    }
  }
  getHighlightColor(space) {
    let color = defaultColors[space.program]
    if (this.props.isGradient.value && this.props.gradient.min) {
      const gradientColor = this.getGradientColorBySpaceValue(space)
      if (gradientColor) color = gradientColor
    }
    return color
  }
  highlightNode(space, fillOpacity = 1.0) {
    if (!space) return
    if (categoriesToHighlight.includes(space.program)) {
      const fillColor = this.getHighlightColor(space)
      space.node.setHighlight({
        fill: fillColor,
        fillOpacity
      })
    }
  }
  highlightNodes(fillOpacity = 1.0) {
    const nodes = getAssetsAndSpaces(floorPlan)
    nodes.forEach((space: any) => {
      this.highlightNode(space, fillOpacity)
    })
  }
  highlightNodesFromProps() {
    this.highlightNodes(0.5)
    this.props.nodeIds.forEach(nodeId => {
      const space = getNodeById(floorPlan, nodeId)
      this.highlightNode(space)
    })
  }
  handleClick() {
    floorPlan.on('click', event => {
      const position: number[] = event.pos
      const selectedSpace = getSpaceByPosition(floorPlan, position)
      if (this.state.selectedSpace === selectedSpace) return
      this.setState({ selectedSpace })
      if (!selectedSpace || !categoriesToHighlight.includes(selectedSpace.program)) return
      this.props.onClick(selectedSpace.id)
    })
  }
  handleHighlightedNodes() {
    if (!this.state.isFloorPlanLoaded) return
    if (this.props.nodeIds.length) {
      this.highlightNodesFromProps()
    } else {
      this.highlightNodes()
    }
  }
  handleLoad(fpe: FloorPlanEngine) {
    this.setState({
      isFloorPlanLoaded: true
    })
    floorPlan = fpe
    this.handleHighlightedNodes()
    this.handleClick()
  }

  render() {
    this.handleHighlightedNodes()
    return (
      <div id="app">
        <FloorPlan
          id={this.props.floorID}
          token={this.props.publishableToken}
          loaded={this.state.isFloorPlanLoaded}
          onLoad={this.handleLoad.bind(this)}
        />
      </div>
    )
  }
}

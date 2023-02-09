import * as React from 'react'
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'
import GradientColor from 'javascript-color-gradient'

import { FloorPlan, hexToRgb } from '../../../../global'

import Legend from './Legend'
import startupOptions from '../common/startupOptions'

import FPEEvtObject from '../types/FPEEvtObject'
import ResourceType from '../types/ResourceType'

export interface Props {
  spaceIDs: string[]
  spaceValues: any[]
  updateSelection: (arg: any) => any
  publishableToken: string
  floorID: string
  isLegendEnabled?: boolean
  dataPointSetting?: any
  gradientObject?: any
  gradientSource?: string
}
export interface State {
  spaceIDs: any[]
  spaceValues: any[]
  publishableToken: string
  floorID: string
}

export const initialState: State = {
  spaceIDs: [],
  spaceValues: [],
  publishableToken: '',
  floorID: ''
}

function clamp(input: number, min: number, max: number): number {
  return input < min ? min : input > max ? max : input
}
function map(
  current: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number {
  const mapped: number = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  return clamp(mapped, out_min, out_max)
}

export class FloorPanel extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = initialState
    this.setStateFromProps = this.setStateFromProps.bind(this)
  }

  setStateFromProps(props) {
    this.updateSelection = props.updateSelection
    if (
      props.publishableToken !== this.state.publishableToken ||
      props.floorID !== this.state.floorID
    ) {
      this.isSameTokenID = false
    } else {
      this.isSameTokenID = true
    }

    this.state = {
      ...this.state,
      spaceIDs: props.spaceIDs,
      spaceValues: props.spaceValues,
      publishableToken: props.publishableToken,
      floorID: props.floorID
    }
    if (props.gradientObject)
      this.linearGradientLegendString = `linear-gradient(90deg, ${props.gradientObject.min.color}, ${props.gradientObject.max.color})`
  }

  isFloorPlanLoaded: boolean = false
  isSameTokenID: boolean = false
  floorPlan: FloorPlanEngine
  updateSelection: Function
  spaceResources: any[]
  selectedResource: any

  spaceColorObjects: any[] = []

  defaultColors = {
    work: [159, 188, 255],
    meet: [121, 204, 205],
    socialize: [241, 102, 100],
    other: [255, 255, 255]
  }

  midPoints = 20
  minColor: string
  maxColor: string
  outMin: number = 0
  outMax: number = this.midPoints - 1

  isGradient: boolean = false
  gradientSource: string
  gradientArray: any[]
  linearGradientLegendString: string = 'linear-gradient(90deg, #e66465, #9198e5)'

  createSpaceColorObjectsDefault(spaceResources) {
    this.spaceColorObjects = []
    spaceResources.forEach(space => {
      if (space.program === 'work' || space.program === 'meet' || space.program === 'socialize') {
        const color = this.defaultColors[space.program]
        const spaceColorObject = {
          ...space,
          displayData: { value: null, gradientIndex: null, color: color }
        }
        spaceColorObject.node.setHighlight({
          fill: color,
          fillOpacity: 1.0
        })
        this.spaceColorObjects.push(spaceColorObject)
      } else {
        const color = this.defaultColors['other']
        const spaceColorObject = {
          ...space,
          displayData: { value: null, gradientIndex: null, color: color }
        }
        spaceColorObject.node.setHighlight({
          fill: color,
          fillOpacity: 1.0
        })
        this.spaceColorObjects.push(spaceColorObject)
      }
    })
  }
  initializeGradients(gradientObject) {
    this.minColor = gradientObject.min.color
    this.maxColor = gradientObject.max.color

    return (this.gradientArray = new GradientColor()
      .setColorGradient(gradientObject.min.color, this.maxColor)
      .setMidpoint(this.midPoints)
      .getColors())
  }
  createSpaceColorObjectsGradient(
    spaceIDs: string[],
    spaceValues,
    spaceResources,
    gradientObject,
    gradientArray
  ) {
    this.spaceColorObjects = []
    for (let i = 0; i < spaceIDs.length; i++) {
      const spaceID = spaceIDs[i]
      const value = spaceValues[i]
      let match = spaceResources.find(space => space.id === spaceID)

      const inMin = gradientObject.min.value
      const inMax = gradientObject.max.value

      if (match) {
        const remappedFloat = map(value, inMin, inMax, this.outMin, this.outMax)
        const remappedInt = Math.trunc(remappedFloat)

        const colorValue = gradientArray[remappedInt]
        const color = hexToRgb(colorValue)

        const spaceColorObject = {
          ...match,
          displayData: { value: value, gradientIndex: remappedInt, color: color }
        }
        spaceColorObject.node.setHighlight({
          fill: color,
          fillOpacity: 1.0
        })

        this.spaceColorObjects.push(spaceColorObject)
      }
    }
  }

  getResource(fpe: any, position: number[]) {
    const positionResources = fpe.getResourcesFromPosition(position)

    const selectedSpace = positionResources.spaces ? positionResources.spaces[0] : false
    const selectedAsset = positionResources.assets ? positionResources.assets[0] : false

    let selectedResource: any
    let selectedResourceType: ResourceType
    if (!selectedAsset) {
      selectedResource = selectedSpace
      selectedResourceType = 'space'
    } else {
      selectedResource = selectedAsset
      selectedResourceType = 'asset'
    }

    return {
      type: selectedResourceType,
      data: selectedResource
    }
  }

  async initFloorPlan(fpe) {
    this.floorPlan = fpe
    this.spaceResources = fpe.resources.spaces

    if (this.props.gradientObject) {
      this.isGradient = true
      this.gradientArray = this.initializeGradients(this.props.gradientObject)
      this.gradientSource = this.props.gradientSource
      this.createSpaceColorObjectsGradient(
        this.props.spaceIDs,
        this.props.spaceValues,
        this.spaceResources,
        this.props.gradientObject,
        this.gradientArray
      )
    } else {
      this.isGradient = false
      this.createSpaceColorObjectsDefault(this.spaceResources)
    }

    fpe.on('click', (event: FPEEvtObject) => {
      const position: number[] = event.pos

      const selectedResource = this.getResource(fpe, position)
      this.selectedResource = selectedResource

      if (!selectedResource.data) return
      if (selectedResource.type !== 'space') return

      this.selectionUpdate(this.spaceColorObjects, [selectedResource.data.id])

      const selectedIDIndex = this.state.spaceIDs.indexOf(selectedResource.data.id)
      this.updateSelection(selectedIDIndex)
    })
  }

  selectionUpdate(spaceColorObjects, spaceIDs) {
    spaceColorObjects.forEach(space => {
      if (spaceIDs.includes(space.id)) {
        space.node.setHighlight({
          fill: space.displayData.color,
          fillOpacity: 1
        })
      } else {
        space.node.setHighlight({
          fill: space.displayData.color,
          fillOpacity: 0.3
        })
      }
    })
  }

  updateFloorPlan(floorPlan: FloorPlanEngine) {
    if (!floorPlan) return
    if (this.state.spaceIDs && this.state.spaceIDs.length === 0) return

    if (this.props.gradientObject) {
      this.isGradient = true
      if (
        this.gradientSource !== this.props.gradientSource ||
        this.minColor !== this.props.gradientObject.min.color ||
        this.maxColor !== this.props.gradientObject.max.color
      ) {
        this.gradientSource = this.props.gradientSource
        this.gradientArray = this.initializeGradients(this.props.gradientObject)
        this.createSpaceColorObjectsGradient(
          this.props.spaceIDs,
          this.props.spaceValues,
          this.spaceResources,
          this.props.gradientObject,
          this.gradientArray
        )
      } else {
        this.selectionUpdate(this.spaceColorObjects, this.state.spaceIDs)
      }
    } else {
      this.isGradient = false
      this.createSpaceColorObjectsDefault(this.spaceResources)
      this.selectionUpdate(this.spaceColorObjects, this.state.spaceIDs)
    }
  }

  render() {
    this.setStateFromProps(this.props)
    this.updateFloorPlan(this.floorPlan)

    return (
      <div id="app">
        {this.props.isLegendEnabled ? (
          <Legend
            isGradient={this.isGradient}
            defaultColors={this.defaultColors}
            gradientObject={this.props.gradientObject}
          />
        ) : null}

        <FloorPlan
          id={this.state.floorID}
          token={this.state.publishableToken}
          startupOptions={startupOptions}
          onLoad={this.initFloorPlan}
        />
      </div>
    )
  }
}

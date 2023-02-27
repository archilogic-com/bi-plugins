import React from 'react'
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'
import './FloorPlan.css'

interface FloorOptions {
  id: string
  token: string
  startupOptions?: any
  loaded?: boolean
  onLoad?: (floorPlan: FloorPlanEngine) => void
}

const FLOOR_PLAN_ID = 'floor-plan'
let floorPlan: FloorPlanEngine

const FloorPanel: React.FC<FloorOptions> = props => {
  const tokenOptions = {
    publishableAccessToken: props.token
  }

  const initFloorPlan = () => {
    const container = document.getElementById(FLOOR_PLAN_ID)
    if (container) {
      if (!props.loaded) {
        floorPlan = new FloorPlanEngine({ container, options: props.startupOptions })
        floorPlan.loadScene(props.id, tokenOptions).then(() => {
          if (props.onLoad) props.onLoad(floorPlan)
        })
      } else {
        if (props.onLoad) props.onLoad(floorPlan)
      }
    }
  }
  setTimeout(initFloorPlan, 500)

  return (
    <div className="plan-wrapper">
      <div id={FLOOR_PLAN_ID} className="plan-container"></div>
    </div>
  )
}

export default FloorPanel

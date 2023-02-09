import React, { useEffect } from 'react'
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'
import '@/components/FloorPlan/FloorPlan.css'

interface FloorOptions {
  id: string
  token: string
  startupOptions?: any
  onLoad?: (floorPlan: FloorPlanEngine) => void
}

let floorPlan: FloorPlanEngine
let isFloorPlanLoaded = false

const FloorPanel: React.FC<FloorOptions> = props => {
  const tokenOptions = {
    publishableAccessToken: props.token
  }
  const onLoaded = props.onLoad || function () {}
  const initFloorPlan = () => {
    const container = document.getElementById('floor-plan')
    if (container) {
      if (!isFloorPlanLoaded) {
        floorPlan = new FloorPlanEngine({ container, options: props.startupOptions })
        floorPlan.loadScene(props.id, tokenOptions).then(() => {
          if (props.onLoad) props.onLoad(floorPlan)
        })
      } else {
        if (props.onLoad) props.onLoad(floorPlan)
      }
    }
  }
  useEffect(initFloorPlan)

  return (
    <div className="plan-wrapper">
      <div id="floor-plan" className="plan-container"></div>
    </div>
  )
}

export default FloorPanel

import React, { useState } from 'react'
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'
import './FloorPlan.css'

interface FloorOptions {
  id: string
  token: string
  startupOptions?: any
  loaded?: boolean
  onLoad?: (floorPlan: FloorPlanEngine) => void
}

const FloorPanel: React.FC<FloorOptions> = props => {
  const [floorPlan, setFloorPlan] = useState(undefined as FloorPlanEngine);
  const floorPlanId = `floor-plan-${new Date().getTime()}`
  const tokenOptions = {
    publishableAccessToken: props.token
  }

  const initFloorPlan = () => {
    const container = document.getElementById(floorPlanId)
    if (container) {
      if (!props.loaded && !floorPlan) {
        const fpe = new FloorPlanEngine({ container, options: props.startupOptions })
        fpe.loadScene(props.id, tokenOptions).then(() => {
          if (props.onLoad) props.onLoad(floorPlan)
        })
        setFloorPlan(fpe)
      } else {
        if (props.onLoad) props.onLoad(floorPlan)
      }
    }
  }
  setTimeout(initFloorPlan, 500)

  return (
    <div className="plan-wrapper">
      <div id={floorPlanId} className="plan-container"></div>
    </div>
  )
}

export default FloorPanel

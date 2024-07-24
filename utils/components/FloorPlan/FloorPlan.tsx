import React, { FC } from 'react'
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'
import './FloorPlan.css'

interface FloorOptions {
  id: string
  token: string
  startupOptions?: any
  loaded?: boolean
  onLoad?: (floorPlan: FloorPlanEngine) => void
}

const FloorPlan: FC<FloorOptions> = (props): JSX.Element => {
  const floorPlanId = `floor-plan-${new Date().getTime()}`
  const tokenOptions = {
    publishableAccessToken: props.token
  }

  const initFloorPlan = () => {
    const container = document.getElementById(floorPlanId)
    if (container) {
      if (!props.loaded) {
        const fpe = new FloorPlanEngine({ container, options: props.startupOptions })
        fpe.loadScene(props.id, tokenOptions).then(() => {
          if (props.onLoad) props.onLoad(fpe)
        })
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

export default FloorPlan

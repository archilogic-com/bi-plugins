import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'

const startupOptions: FloorPlanEngine['settings'] = {
  theme: {
    background: {
      color: 'transparent',
      showGrid: false
    },
    wallContours: false,
    elements: {
      asset: {
        fill: [200, 200, 200],
        stroke: [0, 0, 0],
        strokeWidth: 2
      },
      space: {
        fill: [255, 255, 255],
        program: {
          circulate: { fill: [255, 255, 255], fillOpacity: 0.1 },
          care: { fill: [255, 255, 255], fillOpacity: 0.15 }
        }
      }
    }
  }
}

export default startupOptions

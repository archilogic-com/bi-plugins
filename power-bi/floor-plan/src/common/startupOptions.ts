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
      // wallContour: {
      //   strokeWidth: 4,
      //   fill: [255, 255, 255],
      //   stroke: [0, 0, 0],
      //   fillOpacity: 0.3
      // },
      // roomStamp: { showArea: false },
      // window: {
      //   fillOpacity: 0.15
      // },
      // door: {
      //   fillOpacity: 0.15
      // },
      // stairs: {
      //   fillOpacity: 0.05
      // },
      // closet: {
      //   fillOpacity: 0.1
      // },
      // kitchen: {
      //   fillOpacity: 0.1
      // },
      // box: {
      //   fillOpacity: 0.1
      // }
    }
  }
}

export default startupOptions

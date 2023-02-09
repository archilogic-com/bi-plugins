import { FloorPlanEngine } from '@archilogic/floor-plan-sdk'

export const getAssetsAndSpaces = (floorPlan: FloorPlanEngine) => {
  const { spaces, assets } = floorPlan.resources
  return [...spaces, ...assets]
}

export const getNodeByid = (floorPlan: FloorPlanEngine, id: string) => {
  const nodes = getAssetsAndSpaces(floorPlan)
  return nodes.find(node => node.id === id)
}

export const getNodeByClick = (floorPlan: FloorPlanEngine, evt: any) => {
  const { nodeId } = evt
  if (nodeId) {
    return getNodeByid(floorPlan, nodeId)
  }
}

import { FloorPlanEngine } from '@archilogic/floor-plan-sdk/dist/fpe.umd.js'

export const getAssetsAndSpaces = (floorPlan: FloorPlanEngine) => {
  if (!floorPlan) return []
  const { spaces, assets } = floorPlan.resources
  return [...spaces, ...assets]
}

export const getNodeById = (floorPlan: FloorPlanEngine, id: string) => {
  const nodes = getAssetsAndSpaces(floorPlan)
  return nodes.find(node => node.id === id)
}

export const getNodeByClick = (floorPlan: FloorPlanEngine, evt: any) => {
  const { nodeId } = evt
  if (nodeId) {
    return getNodeById(floorPlan, nodeId)
  }
}

export const getSpaceByPosition = (floorPlan: FloorPlanEngine, position: number[]) => {
  const point2d = position
  const positionResources = floorPlan.getResourcesFromPosition(point2d as [number, number])
  return positionResources.spaces ? positionResources.spaces[0] : false
}

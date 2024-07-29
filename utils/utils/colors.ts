import colorGradient from 'javascript-color-gradient'

export function valueToHex(color: number) {
  const hex = color.toString(16)
  return hex
}

export function rgbToHex(rgbArray: number[]) {
  return valueToHex(rgbArray[0]) + valueToHex(rgbArray[1]) + valueToHex(rgbArray[2])
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

export function generateGradients(colorFrom: string, colorTo: string, midpoint = 10) {
  return new colorGradient().setColorGradient(colorFrom, colorTo).setMidpoint(midpoint).getColors()
}

function splitArray(array: any[], numberOfSubArrays: number) {
  const chunkSize = Math.ceil(array.length / numberOfSubArrays)
  return Array.from({ length: numberOfSubArrays }, (_, i) =>
    array.slice(i * chunkSize, (i + 1) * chunkSize)
  )
}

export function getGradientColorBySpaceValue (colorFrom: string, colorTo: string, allDataEntries: Map<string, any>, spaceId: string): number[] {
  if (allDataEntries.size > 0) {
    const gradient = generateGradients(colorFrom, colorTo)
    const values = allDataEntries.values()
    const uniqueValues = [...new Set(values)] // remove duplicates
    const sortedValues = uniqueValues.sort((a, b) => a - b) // sort asc to match gradients from min to max
    const distributedValues = splitArray(sortedValues, gradient.length) // chunk values to match gradient's count

    const value = allDataEntries.get(spaceId)
    if (value) {
      for (let i = 0; i < distributedValues.length; i++) {
        if (distributedValues[i].indexOf(value) != -1) {
            const rgb = gradient[i] // get rgb based on value's gradient
            return hexToRgb(rgb)
        }
      }
    }
  } else {
    return null
  }
}

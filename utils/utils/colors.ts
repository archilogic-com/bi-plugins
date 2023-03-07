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

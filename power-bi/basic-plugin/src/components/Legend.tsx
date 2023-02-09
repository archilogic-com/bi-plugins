import React from 'react'
import { rgbToHex } from '../../../../global'

type LegendProps = {
  isGradient: boolean
  defaultColors: any
  gradientObject: any
}


export default function Legend({
  isGradient,
  defaultColors,
  gradientObject
}: LegendProps): JSX.Element {
  const keys = Object.keys(defaultColors)
  const defaultColorBars = keys.map(key => {
    if (key === 'other') return
    const color = defaultColors[key]
    const hexColor = rgbToHex(color)
    return (
      <div key={key} className="default-wrapper">
        <div className="default-bars" style={{ background: `#${hexColor}` }}></div>
        <span>{key}</span>
      </div>
    )
  })

  let linearGradientLegendString: string
  isGradient
    ? (linearGradientLegendString = `linear-gradient(90deg, ${gradientObject.min.color}, ${gradientObject.max.color})`)
    : null

  return (
    <div id="legend">
      {isGradient ? (
        <div id="gradient-cont">
          <div id="gradient-bar" style={{ background: linearGradientLegendString }}></div>
          <span id="min-value">{gradientObject.min.value}</span>
          <span id="max-value">{gradientObject.max.value}</span>
        </div>
      ) : (
        <div id="default-cont">{defaultColorBars}</div>
      )}
    </div>
  )
}

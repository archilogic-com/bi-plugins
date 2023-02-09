import { generateGradients } from '../../../../global';
import { createTheme } from '@grafana/data';

const theme = createTheme();

export function getGrafanaHexColorByName(name: string) {
  const colors = theme.visualization.hues;
  let finalColor = '';
  colors.forEach((color) => {
    color.shades.forEach((shade) => {
      if (shade.name === name) {
        // @ts-ignore-next-line
        finalColor = shade.color;
      }
    });
  });
  return finalColor;
}

export function checkColors(colorValue: string) {
  if (colorValue.includes('#')) {
    return colorValue;
  } else {
    return getGrafanaHexColorByName(colorValue);
  }
}

export function getGradients(colorFrom: string, colorTo: string) {
  const colorHexFrom = checkColors(colorFrom);
  const colorHexTo = checkColors(colorTo);
  return generateGradients(colorHexFrom, colorHexTo)
}

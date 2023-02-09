export const getGrafanaHexColorByName = (theme: { visualization: { hues: []}}, name: string) => {
  const colors = theme.visualization.hues;
  let finalColor = '';
  colors.forEach((color: { shades: []}) => {
    color.shades.forEach((shade: { name: string}) => {
      if (shade.name === name) {
        // @ts-ignore-next-line
        finalColor = shade.color;
      }
    });
  });
  return finalColor;
}
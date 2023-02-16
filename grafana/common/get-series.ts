import { PanelData, DataFrame } from '@grafana/data'


export const getBuffer = (serie: DataFrame, index: number) => {
  // @ts-ignore-next-line
  return serie?.fields?.[index]?.values.buffer || []
}
export const getSeries = (data: PanelData) => {
  const series = data?.series
  let ids: string[] = []
  let values: string[] = []
  if (series) {
    series.forEach(serie => (ids = ids.concat(getBuffer(serie, 0))))
    series.forEach(serie => (values = values.concat(getBuffer(serie, 1))))
  }
  return { ids, values }
}
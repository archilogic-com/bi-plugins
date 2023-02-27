import { floorId, token } from '@bi-plugin-utils'
import { PanelPlugin } from '@grafana/data'
import { FloorOptions } from './types'
import { FloorPanel } from './components/FloorPanel'

export const plugin = new PanelPlugin<FloorOptions>(FloorPanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'id',
      name: 'Floor plan ID',
      description: 'Description of panel option',
      defaultValue: floorId
    })
    .addTextInput({
      path: 'token',
      name: 'Publishable Token',
      description: 'Description of panel option',
      defaultValue: token
    })
    .addTextInput({
      path: 'nodeId',
      name: 'Node id',
      description: 'Space or Asset id',
      defaultValue: ''
    })
    .addColorPicker({
      path: 'colorFrom',
      name: 'Color From',
      defaultValue: '#fff000',
      settings: {
        mode: 'custom'
      }
    })
    .addColorPicker({
      path: 'colorTo',
      name: 'Color To',
      defaultValue: '#000fff'
    })
})

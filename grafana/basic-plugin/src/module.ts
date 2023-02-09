import { PanelPlugin } from '@grafana/data';
import { FloorOptions } from './types';
import { FloorPanel } from './components/FloorPanel';

export const plugin = new PanelPlugin<FloorOptions>(FloorPanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'id',
      name: 'Floor plan ID',
      description: 'Description of panel option',
      defaultValue: 'f95ec51c-0ff4-47dd-929c-45cfc6d2902b',
    })
    .addTextInput({
      path: 'token',
      name: 'Publishable Token',
      description: 'Description of panel option',
      defaultValue: 'a7d13bd9-2991-47e7-a392-e00456f3ebac',
    })
    .addTextInput({
      path: 'nodeId',
      name: 'Node id',
      description: 'Space or Asset id',
      defaultValue: '',
    })
    .addColorPicker({
      path: 'colorFrom',
      name: 'Color From',
      defaultValue: '#fff000',
      settings: {
        mode: 'custom',
      },
    })
    .addColorPicker({
      path: 'colorTo',
      name: 'Color To',
      defaultValue: '#000fff',
    });
});

import { formattingSettings } from 'powerbi-visuals-utils-formattingmodel'
import { dataViewWildcard } from 'powerbi-visuals-utils-dataviewutils'

import FormattingSettingsCard = formattingSettings.Card
import FormattingSettingsSlice = formattingSettings.Slice
import FormattingSettingsModel = formattingSettings.Model
import { floorId, token } from '../../../utils';
class ArchilogicPluginSettings extends FormattingSettingsCard {
  publishableToken = new formattingSettings.TextInput({
    name: 'publishableToken',
    displayName: 'Publishable Token',
    value: token,
    placeholder: 'Publishable Token'
  })

  floorID = new formattingSettings.TextInput({
    name: 'floorID',
    displayName: 'Floor ID',
    value: floorId,
    placeholder: 'Floor ID'
  })

  name: string = 'archilogicPlugin'
  displayName: string = 'Archilogic Plugin'
  slices: Array<FormattingSettingsSlice> = [this.publishableToken, this.floorID]
}

class GradientSettings extends FormattingSettingsCard {
  show = new formattingSettings.ToggleSwitch({
    name: 'show',
    displayName: undefined,
    value: false,
    topLevelToggle: false
  })

  name: string = 'enableGradient'
  displayName: string = 'Enable Gradient'
  slices: Array<FormattingSettingsSlice> = [this.show]
}

class DataPointSettings extends FormattingSettingsCard {
  defaultColor = new formattingSettings.ColorPicker({
    name: 'defaultColor',
    displayName: 'Default Color',
    value: { value: '' },
    selector: dataViewWildcard.createDataViewWildcardSelector(
      dataViewWildcard.DataViewWildcardMatchingOption.InstancesAndTotals
    ),
    instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
  })

  name: string = 'dataPoint'
  displayName: string = 'Data Colors'
  slices: Array<FormattingSettingsSlice> = [this.defaultColor]
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
  archilogicPluginSettings = new ArchilogicPluginSettings()
  enableGradient = new GradientSettings()
  dataPoint = new DataPointSettings()

  cards = [this.archilogicPluginSettings, this.enableGradient, this.dataPoint]
}

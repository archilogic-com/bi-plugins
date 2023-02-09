/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

'use strict'

import { formattingSettings } from 'powerbi-visuals-utils-formattingmodel'
import { dataViewWildcard } from 'powerbi-visuals-utils-dataviewutils'

import FormattingSettingsCard = formattingSettings.Card
import FormattingSettingsSlice = formattingSettings.Slice
import FormattingSettingsModel = formattingSettings.Model

class ArchilogicPluginSettings extends FormattingSettingsCard {
  publishableToken = new formattingSettings.TextInput({
    name: 'publishableToken',
    displayName: 'Publishable Token',
    value: '',
    placeholder: 'Publishable Token'
  })

  floorID = new formattingSettings.TextInput({
    name: 'floorID',
    displayName: 'Floor ID',
    value: '',
    placeholder: 'Floor ID'
  })

  name: string = 'archilogicPlugin'
  displayName: string = 'Archilogic Plugin'
  slices: Array<FormattingSettingsSlice> = [this.publishableToken, this.floorID]
}

class EnableLegendSettings extends FormattingSettingsCard {
  show = new formattingSettings.ToggleSwitch({
    name: 'show',
    displayName: undefined,
    value: false,
    topLevelToggle: false
  })

  name: string = 'enableLegend'
  displayName: string = 'Enable Legend'
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
  enableLegend = new EnableLegendSettings()
  dataPoint = new DataPointSettings()

  cards = [this.archilogicPluginSettings, this.enableLegend, this.dataPoint]
}

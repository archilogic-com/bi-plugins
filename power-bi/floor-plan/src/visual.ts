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
import powerbi from 'powerbi-visuals-api'

import DataView = powerbi.DataView
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import IVisual = powerbi.extensibility.visual.IVisual

//Customise Format Pane using Formatting Model Utils API
import FormattingModel = powerbi.visuals.FormattingModel
import { FormattingSettingsService } from 'powerbi-visuals-utils-formattingmodel'
import { VisualFormattingSettingsModel } from './settings'

//Interactivity with host (selection)
import IVisualHost = powerbi.extensibility.visual.IVisualHost
import ISelectionManager = powerbi.extensibility.ISelectionManager

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { FloorPlan, initialState } from './components/FloorPlan'

import './../style/visual.less'

export class Visual implements IVisual {
  private target: HTMLElement
  private reactRoot: React.ComponentElement<any, any>
  private formattingSettings: VisualFormattingSettingsModel
  private formattingSettingsService: FormattingSettingsService
  private host: IVisualHost
  private selectionManager: ISelectionManager
  private dataPoints = []
  private categories
  private measures
  private spaceCount
  private gradientObject
  private gradientSource: string

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(FloorPlan, { initialState })
    this.target = options.element
    this.formattingSettingsService = new FormattingSettingsService()
    this.host = options.host
    this.selectionManager = this.host.createSelectionManager()
    this.selectionManager.clear()

    ReactDOM.render(this.reactRoot, this.target)
  }

  public update(options: VisualUpdateOptions) {
    this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
      VisualFormattingSettingsModel,
      options.dataViews
    )
    const enableLegendSetting = this.formattingSettings.enableLegend
    const dataPointSetting = this.formattingSettings.dataPoint

    const publishableToken = this.formattingSettings.archilogicPluginSettings.publishableToken.value
    const floorID = this.formattingSettings.archilogicPluginSettings.floorID.value

    if (options.dataViews && options.dataViews[0]) {
      const dataView: DataView = options.dataViews[0]

      const categories = dataView.categorical.categories
      const measures = dataView.categorical.values

      const metadata: any = dataView.metadata
      const objectsRules = metadata.objectsRules

      if (objectsRules) {
        const gradientOptions = objectsRules.dataPoint.defaultColor.gradient.options
        const key = Object.keys(gradientOptions)[0]
        this.gradientObject = gradientOptions[key]
        this.gradientSource = objectsRules.dataPoint.defaultColor.gradient.source.queryName
      } else {
        this.gradientObject = null
      }

      if (!this.categories) this.categories = categories
      if (!this.measures) this.measures = measures
      if (!this.spaceCount) this.spaceCount = categories[0].values.length

      const categoriesCount = categories[0].values.length

      for (let categoryIndex = 0; categoryIndex < categoriesCount; categoryIndex++) {
        const categoryValue: powerbi.PrimitiveValue = categories[0].values[categoryIndex]

        const categorySelectionId = this.host
          .createSelectionIdBuilder()
          .withCategory(categories[0], categoryIndex)
          .createSelectionId()
        this.dataPoints.push({
          value: categoryValue,
          selection: categorySelectionId
        })
      }

      const selectionManager = this.selectionManager
      const dataPoints = this.dataPoints

      function updateSelection(categoryIndex: number) {
        selectionManager.clear()
        const categorySelectionId = dataPoints[categoryIndex].selection
        selectionManager.select(categorySelectionId)
      }

      this.reactRoot = React.createElement(FloorPlan, {
        spaceIDs: dataView.categorical.categories[0].values,
        spaceValues: dataView.categorical.values[0].values,
        spaceCount: this.spaceCount,
        updateSelection: updateSelection,
        publishableToken: publishableToken,
        floorID: floorID,
        isLegendEnabled: enableLegendSetting.show.value,
        gradientObject: this.gradientObject,
        gradientSource: this.gradientSource,
        dataPointSetting: dataPointSetting
      })
      ReactDOM.render(this.reactRoot, this.target)
    }
  }

  public getFormattingModel(): FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(this.formattingSettings)
  }
}

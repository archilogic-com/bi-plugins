import powerbi from 'powerbi-visuals-api'
import { FormattingSettingsService } from 'powerbi-visuals-utils-formattingmodel'
import { VisualFormattingSettingsModel } from './settings'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { FloorPanel } from './components/FloorPanel'
import './../style/visual.less'

import FormattingModel = powerbi.visuals.FormattingModel
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import IVisual = powerbi.extensibility.visual.IVisual
import IVisualHost = powerbi.extensibility.visual.IVisualHost
import ISelectionManager = powerbi.extensibility.ISelectionManager

export class Visual implements IVisual {
  private target: HTMLElement
  private formattingSettings: VisualFormattingSettingsModel
  private formattingSettingsService: FormattingSettingsService
  private host: IVisualHost
  private selectionManager: ISelectionManager
  private gradient
  private dataView
  private selectedSpaceId: string
  private allCategories

  constructor(options: VisualConstructorOptions) {
    this.target = options.element
    this.formattingSettingsService = new FormattingSettingsService()
    this.host = options.host
    this.selectionManager = this.host.createSelectionManager()
    this.handleContextMenu()
    this.selectionManager.clear()
  }

  private handleContextMenu() {
    // @ts-ignore
    this.target.oncontextmenu = (mouseEvent: PointerEvent, dataPoint) => {
      this.selectionManager.showContextMenu(dataPoint ? dataPoint: {}, {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
      });
      mouseEvent.preventDefault();
    };
  }

  private setGradient(objectsRules) {
    if (objectsRules) {
      const gradient = objectsRules.dataPoint.defaultColor.gradient
      const gradientOptions = gradient.options
      const gradientKey = Object.keys(gradientOptions)[0]
      this.gradient = gradientOptions[gradientKey]
    } else {
      this.gradient = null
    }
  }

  private updateSelectionBySpaceId(spaceId: string) {
    let categoryIndex
    const categories = this.allCategories
    categories.forEach(category => {
      const valueIndex = category.values.findIndex(value => value === spaceId)
      if (valueIndex) categoryIndex = category?.identity?.[valueIndex]?.identityIndex
    })
    if (categoryIndex) {
      const categorySelectionId = this.host
        .createSelectionIdBuilder()
        .withCategory(categories[0], categoryIndex)
        .createSelectionId()
      this.selectionManager.select(categorySelectionId)
    }
    return categoryIndex
  }

  private setSelectedSpaceId(spaceId: string) {
    this.selectionManager.clear()
    this.selectedSpaceId = spaceId
    const nodeIds = [this.selectedSpaceId]
    this.updateSelectionBySpaceId(spaceId)
    this.renderReactComponent(nodeIds)
  }

  private renderReactComponent(nodeIds, nodeValues?) {
    const onClick = this.setSelectedSpaceId.bind(this)
    const reactElement = React.createElement(FloorPanel, {
      publishableToken: this.formattingSettings.archilogicPluginSettings.publishableToken.value,
      floorID: this.formattingSettings.archilogicPluginSettings.floorID.value,
      isGradient: this.formattingSettings.enableGradient.slices[0],
      gradient: this.gradient,
      nodeValues,
      nodeIds,
      onClick
    })
    ReactDOM.render(reactElement, this.target)
  }

  public update(options: VisualUpdateOptions) {
    this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
      VisualFormattingSettingsModel,
      options.dataViews
    )

    this.dataView = options.dataViews[0]
    if (!this.allCategories?.length) this.allCategories = this.dataView?.categorical?.categories

    const { objectsRules } = this.dataView.metadata as any
    const nodeIds = this.dataView.categorical.categories[0].values
    const nodeValues = this.dataView.categorical.values[0].values
    this.setGradient(objectsRules)
    this.renderReactComponent(nodeIds, nodeValues)
  }

  public getFormattingModel(): FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(this.formattingSettings)
  }
}

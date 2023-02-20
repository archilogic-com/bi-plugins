import powerbi from 'powerbi-visuals-api';
import './../style/visual.less';
import FormattingModel = powerbi.visuals.FormattingModel;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private target;
    private formattingSettings;
    private formattingSettingsService;
    private host;
    private selectionManager;
    private gradient;
    private dataView;
    private selectedSpaceId;
    constructor(options: VisualConstructorOptions);
    private setGradient;
    private updateSelectionBySpaceId;
    private setSelectedSpaceId;
    private renderReactComponent;
    update(options: VisualUpdateOptions): void;
    getFormattingModel(): FormattingModel;
}

import powerbi from 'powerbi-visuals-api';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import FormattingModel = powerbi.visuals.FormattingModel;
import './../style/visual.less';
export declare class Visual implements IVisual {
    private target;
    private reactRoot;
    private formattingSettings;
    private formattingSettingsService;
    private host;
    private selectionManager;
    private dataPoints;
    private categories;
    private measures;
    private spaceCount;
    private gradientObject;
    private gradientSource;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    getFormattingModel(): FormattingModel;
}

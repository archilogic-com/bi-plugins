import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var floorPlanVisualizationA490C0576F6341F78AFFF9E2E83E7396_DEBUG: IVisualPlugin = {
    name: 'floorPlanVisualizationA490C0576F6341F78AFFF9E2E83E7396_DEBUG',
    displayName: 'floorPlanVisualization',
    class: 'Visual',
    apiVersion: '5.1.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["floorPlanVisualizationA490C0576F6341F78AFFF9E2E83E7396_DEBUG"] = floorPlanVisualizationA490C0576F6341F78AFFF9E2E83E7396_DEBUG;
}
export default floorPlanVisualizationA490C0576F6341F78AFFF9E2E83E7396_DEBUG;
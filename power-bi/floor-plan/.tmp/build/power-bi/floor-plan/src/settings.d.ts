import { formattingSettings } from 'powerbi-visuals-utils-formattingmodel';
import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
declare class ArchilogicPluginSettings extends FormattingSettingsCard {
    publishableToken: formattingSettings.TextInput;
    floorID: formattingSettings.TextInput;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
declare class GradientSettings extends FormattingSettingsCard {
    show: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
declare class DataPointSettings extends FormattingSettingsCard {
    defaultColor: formattingSettings.ColorPicker;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    archilogicPluginSettings: ArchilogicPluginSettings;
    enableGradient: GradientSettings;
    dataPoint: DataPointSettings;
    cards: (ArchilogicPluginSettings | GradientSettings | DataPointSettings)[];
}
export {};

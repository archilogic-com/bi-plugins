import * as React from 'react';
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk';
import ResourceType from '../types/ResourceType';
export interface Props {
    spaceIDs: string[];
    spaceValues: any[];
    updateSelection: (arg: any) => any;
    publishableToken: string;
    floorID: string;
    isLegendEnabled?: boolean;
    dataPointSetting?: any;
    gradientObject?: any;
    gradientSource?: string;
}
export interface State {
    spaceIDs: any[];
    spaceValues: any[];
    publishableToken: string;
    floorID: string;
}
export declare const initialState: State;
export declare class FloorPlan extends React.Component<Props, State> {
    constructor(props: any);
    setStateFromProps(props: any): void;
    container: HTMLElement;
    isFloorPlanLoaded: boolean;
    isSameTokenID: boolean;
    floorPlan: FloorPlanEngine;
    updateSelection: Function;
    spaceResources: any[];
    selectedResource: any;
    spaceColorObjects: any[];
    defaultColors: {
        work: number[];
        meet: number[];
        socialize: number[];
        other: number[];
    };
    midPoints: number;
    minColor: string;
    maxColor: string;
    outMin: number;
    outMax: number;
    isGradient: boolean;
    gradientSource: string;
    gradientArray: any[];
    linearGradientLegendString: string;
    createSpaceColorObjectsDefault(spaceResources: any): void;
    initializeGradients(gradientObject: any): any;
    createSpaceColorObjectsGradient(spaceIDs: string[], spaceValues: any, spaceResources: any, gradientObject: any, gradientArray: any): void;
    getResource(fpe: any, position: number[]): {
        type: ResourceType;
        data: any;
    };
    initFloorPlan(container: any): Promise<void>;
    componentDidMount(): void;
    selectionUpdate(spaceColorObjects: any, spaceIDs: any): void;
    updateFloorPlan(floorPlan: FloorPlanEngine, state: any): void;
    render(): JSX.Element;
}

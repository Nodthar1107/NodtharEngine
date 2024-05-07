import * as React from 'react';

export enum BlueprintNodeType {
    EntryPoint,

    FunctionalNode,

    TransformationNode
}

export interface IBlueprintNode {
    posX: number;
    posY: number;
    nodeId: string;
    label: string;
    type: BlueprintNodeType;
    description: string;
    schema: string;
}

export interface IBlueprintDescriptor {
    nodeId: string;
    label: string;
    description: string;
    group: string;
    icon?: React.ReactElement;
}

export enum BlueprintEditorOperationType {
    PlaceElement
}

export interface IEditorOperation {
    type: BlueprintEditorOperationType;
}

export interface IPlaceElementOperation extends IEditorOperation {
    nodeId: string;
}

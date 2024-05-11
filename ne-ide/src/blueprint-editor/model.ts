import * as React from 'react';

export enum BlueprintNodeType {
    Event,

    FunctionalNode,

    TransformationNode
}

export interface IBlueprintNode {
    posX: number;
    posY: number;
    nodeId: string;
    uuid: string;
    label: string;
    type: BlueprintNodeType;
    description: string;
    schema: string;
    uischema: string;
    data: any;
}

export interface IBlueprintBlockDescriptor {
    nodeId: string;
    label: string;
    description: string;
    group: string;
    icon?: React.ReactElement;
}

export interface IBlueprintPipelineLink {
    uuid: string;
    leftNodeUUID: string;
    rightNodeUUID?: string;
    startPointPosX: number;
    startPointPosY: number;
    endPointPosX: number;
    endPointPosY: number;
}

export enum BlueprintType {
    Scene = 'Scene',
    Actor = 'Actor',
    Pawn = 'Pawn'
}

export interface IAssignedModelDescriptor {
    label: string;
    uri: string;
}

export interface IBlueprintDescriptor {
    type: BlueprintType;
    assignedModelRef?: IAssignedModelDescriptor;
    nodes: IBlueprintNode[];
    links: IBlueprintPipelineLink[];
}

export enum BlueprintEditorOperationType {
    PlaceElement,

    DragEditor,

    DragElement,

    CreatePipelineLink
}

export interface IEditorOperation {
    type: BlueprintEditorOperationType;
}

export interface IPlaceElementOperation extends IEditorOperation {
    nodeId: string;
}

export interface IDragEditorOperation extends IEditorOperation {}

export interface IDragNodeOperation extends IEditorOperation {
    nodeIndex: number;
}

export interface ICreateLinkOperation extends IEditorOperation {
    link: IBlueprintPipelineLink;
}

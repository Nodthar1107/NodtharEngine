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

export interface IBlueprintDescriptor {
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

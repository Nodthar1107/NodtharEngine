import * as React from 'react';
import { BlueprintNodeType } from './model';

import './style.scss';

interface IBlueprintNodeProps {
    posX: number;
    posY: number;
    nodeId: string;
    uuid: string;
    label: string;
    type: BlueprintNodeType;
    description: string;
    schema: string;

    pipelinePointIcon: React.ReactElement;

    isDraggable?: boolean;

    onInputPipelinePointClick?: () => void;
    onOutputPipelinePointClick?: (nodeUUID: string, posX: number, posY: number) => void;

    onNodeMouseDown: (event: React.MouseEvent) => void;
    onContextMenu: (event: React.MouseEvent, uuid: string) => void;
}

export const BlueprintNode: React.FC<IBlueprintNodeProps> = (props: IBlueprintNodeProps): React.ReactElement => {
    const className = [
        'blueprint-node',
        props.isDraggable && 'blueprint-node_draggable'
    ].filter(Boolean).join(' ');
    
    return (
        <div
            className={className}
            title={props.description}
            style={{
                left: props.posX,
                top: props.posY
            }}
            onMouseDown={props.onNodeMouseDown}
            onContextMenu={(event) => props.onContextMenu(event, props.uuid)}>
            <NodeHeader label={props.label} description={props.description} nodeType={props.type} />
            <PipelinePoints type={props.type} pipelineIcon={props.pipelinePointIcon} />
            <div className='blueprint-node__body'></div>
        </div>
    )
}

interface INodeHeaderProps {
    label: string;
    description: string;
    nodeType: BlueprintNodeType;
}

const NodeHeader: React.FC<INodeHeaderProps> = (props: INodeHeaderProps): React.ReactElement => {
    let className = 'blueprint-node__header';

    switch (props.nodeType) {
        case BlueprintNodeType.Event:
            className += ` ${className}_event`;
            break;
        case BlueprintNodeType.FunctionalNode:
            className += ` ${className}_functional-node`;
            break;
        case BlueprintNodeType.TransformationNode:
            className += ` ${className}_transformation-node`;
    }
    
    return (
        <div className={className}>
            <div className='blueprint-node__title'>{props.label}</div>
            <div className='blueprint-node__description'>{props.description}</div>    
        </div>
    )
}

interface IPipelinePoints {
    type: BlueprintNodeType;
    pipelineIcon: React.ReactElement;
}

const PipelinePoints: React.FC<IPipelinePoints> = (props: IPipelinePoints): React.ReactElement => {
    const usePipelineInput = props.type !== BlueprintNodeType.Event;
    
    return (
        <div className='blueprint-node-pipeline-points'>
            <div
                className='blueprint-node-pipeline-points__pipeline-input'
                style={{
                    visibility: usePipelineInput ? 'visible' : 'hidden'
                }}>
                {props.pipelineIcon}
            </div>
            <div className='blueprint-node-pipeline-points__pipeline-output'>
                {props.pipelineIcon}
            </div>
        </div>
    );
}

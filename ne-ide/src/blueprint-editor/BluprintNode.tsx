import * as React from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { BlueprintNodeType } from './model';
import { blueprintRenderers } from '../controls';

import './style.scss';
import { JsonFormsCore } from '@jsonforms/core';

interface IBlueprintNodeProps {
    posX: number;
    posY: number;
    nodeId: string;
    label: string;
    type: BlueprintNodeType;
    description: string;
    schema: string;
    uischema: string;
    data: any;

    pipelinePointIcon: React.ReactElement;

    isDraggable?: boolean;

    onInputPipelinePointClick?: (posX: number, posY: number) => void;
    onOutputPipelinePointClick?: (posX: number, posY: number) => void;
    onNodeMouseDown?: (event: React.MouseEvent) => void;

    onNodeValuesChange: (state: Pick<JsonFormsCore, 'data' | 'errors'>) => void;

    onContextMenu: (event: React.MouseEvent) => void;
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
            onContextMenu={(event) => props.onContextMenu(event)}>
            <NodeHeader label={props.label} description={props.description} nodeType={props.type} />
            <PipelinePoints
                type={props.type}
                pipelineIcon={props.pipelinePointIcon}
                onOutputPipelinePointClick={props.onOutputPipelinePointClick}
                onInputPipelinePointClick={props.onInputPipelinePointClick}
            />
            <BlueprintBody data={props.data} shcema={props.schema} uischema={props.uischema} onChange={props.onNodeValuesChange} />
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

    onOutputPipelinePointClick?: (posX: number, posY: number) => void;
    onInputPipelinePointClick?: (posX: number, posY: number) => void;
}

const PipelinePoints: React.FC<IPipelinePoints> = (props: IPipelinePoints): React.ReactElement => {
    const usePipelineInput = props.type !== BlueprintNodeType.Event;
    const outputPipelineRef = React.useRef<HTMLDivElement>(null);
    const inputPipelineRef = React.useRef<HTMLDivElement>(null);
    
    const outputPipelineClick = (event: React.MouseEvent) => {
        event.stopPropagation();

        const rect = outputPipelineRef.current?.getBoundingClientRect() as DOMRect;
        props.onOutputPipelinePointClick?.(rect.left, rect.top);
    }

    const inputPipelineClick = (event: React.MouseEvent) => {
        event.stopPropagation();

        const rect = inputPipelineRef.current?.getBoundingClientRect() as DOMRect;
        props.onInputPipelinePointClick?.(rect.left + rect.width * 1.5, rect.top);
    }

    return (
        <div className='blueprint-node-pipeline-points'>
            <div
                className='blueprint-node-pipeline-points__pipeline-input'
                onClick={inputPipelineClick}
                style={{
                    visibility: usePipelineInput ? 'visible' : 'hidden'
                }}
                ref={inputPipelineRef}>
                {props.pipelineIcon}
            </div>
            <div
                className='blueprint-node-pipeline-points__pipeline-output'
                onClick={outputPipelineClick}
                ref={outputPipelineRef}>
                {props.pipelineIcon}
            </div>
        </div>
    );
}

interface IBlueprintBody {
    shcema: string;
    uischema: string;
    data: any;

    onChange: (state: Pick<JsonFormsCore, 'data' | 'errors'>) => void;
}

const BlueprintBody: React.FC<IBlueprintBody> = (props: IBlueprintBody): React.ReactElement => {
    if (props.shcema) {
        const a = (state: Pick<JsonFormsCore, 'data' | 'errors'>) => {
            // TODO: исправить костыль
            if (JSON.stringify(props.data) !== JSON.stringify(state.data)) {
                props.onChange(state);
            }
        }

        return (
            <div className='blueprint-node__body'>
                <JsonForms
                    schema={JSON.parse(props.shcema)}
                    uischema={JSON.parse(props.uischema)}
                    data={props.data}
                    renderers={blueprintRenderers} 
                    cells={materialCells}
                    onChange={a}
                />
            </div>
        );
    }

    return <></>;
}

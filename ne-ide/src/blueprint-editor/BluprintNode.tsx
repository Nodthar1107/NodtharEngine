import * as React from 'react';
import { BlueprintNodeType } from './model';

import './style.scss';

interface IBlueprintNodeProps {
    posX: number;
    posY: number;
    nodeId: string;
    label: string;
    type: BlueprintNodeType;
    description: string;
    schema: string;

    isDraggable?: boolean;

    onNodeMouseDown: (event: React.MouseEvent) => void;
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
            onContextMenu={props.onContextMenu}>
            <div className='blueprint-node__header'>{props.label}</div>
            <div className='blueprint-node__body'></div>
        </div>
    )
}

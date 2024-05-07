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
}

export const BlueprintNode: React.FC<IBlueprintNodeProps> = (props: IBlueprintNodeProps): React.ReactElement => {
    return (
        <div
            className='blueprint-node'
            title={props.description}
            style={{
                left: props.posX,
                top: props.posY
            }}>
            <div className='blueprint-node__header'>{props.label}</div>
            <div className='blueprint-node__body'></div>
        </div>
    )
}

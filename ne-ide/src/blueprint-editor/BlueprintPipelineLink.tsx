import * as React from 'react';

interface IBlueprintPipelineLinkProps {
    startPointPosX: number;
    startPointPosY: number;
    endPointPosX: number;
    endPointPosY: number;
    onContext: (event: React.MouseEvent) => void;
}

export const BlueprintPipelineLink: React.FC<IBlueprintPipelineLinkProps> = (
    props: IBlueprintPipelineLinkProps
): React.ReactElement => {
    const linkLength = Math.sqrt(
        Math.pow(props.endPointPosX - props.startPointPosX, 2) +
        Math.pow(props.endPointPosY - props.startPointPosY, 2)
    ) - 10;
    const degNegate = !(props.endPointPosY >= props.startPointPosY);
    const countedDeg = (Math.atan(
        (props.endPointPosX - props.startPointPosX) /
        (props.endPointPosY - props.startPointPosY)
    ) * 57.29578) * (degNegate ? 1 : -1) + 90;
    const deg = props.endPointPosY > props.startPointPosY ? countedDeg : -countedDeg;

    return (
        <div
            className='blueprint-pipeline-link'
            style={{
                left: props.startPointPosX,
                top: props.startPointPosY,

                width: linkLength,
                transformOrigin: '8px 8px',
                transform: `rotate(${deg}deg)`
            }}
            onContextMenu={props.onContext} 
        />
    );
}
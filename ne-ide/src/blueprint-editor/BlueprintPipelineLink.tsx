import * as React from 'react';

interface IBlueprintPipelineLinkProps {
    startPointPosX: number;
    startPointPosY: number;
    endPointPosX: number;
    endPointPosY: number;
}

export const BlueprintPipelineLink: React.FC<IBlueprintPipelineLinkProps> = (
    props: IBlueprintPipelineLinkProps
): React.ReactElement => {
    const linkLength = Math.sqrt(
        Math.pow(props.endPointPosX - props.startPointPosX, 2) +
        Math.pow(props.endPointPosY - props.startPointPosY, 2)
    );

    return (
        <div
            className='blueprint-pipeline-link'
            style={{
                left: props.startPointPosX,
                top: props.startPointPosY,

                width: linkLength,
                transform: `rotate(${0}deg)`
            }}    
        />
    );
}
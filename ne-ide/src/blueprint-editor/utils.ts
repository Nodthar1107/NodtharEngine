import { Guid } from 'guid-typescript';
import { IBlueprintPipelineLink } from './model';

export function createPipelineLink(posX: number, posY: number, leftNodeUUID: string): IBlueprintPipelineLink {
    return {
        uuid: Guid.create().toString(),
        startPointPosX: posX,
        startPointPosY: posY,
        endPointPosX: posX,
        endPointPosY: posY,
        leftNodeUUID: leftNodeUUID
    };
}
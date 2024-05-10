import { IEventEmitterProvider } from '../core/utils/events/IEventEmitterProvider';
import { BlueprintType, IBlueprintBlockDescriptor, IBlueprintDescriptor, IBlueprintPipelineLink } from './model';
import { BlueprintEditorEvents } from './events';

export interface IBlueprintsInfoProvider extends IEventEmitterProvider<BlueprintEditorEvents> {
    getBlueprintsLibrary: () => IBlueprintBlockDescriptor[];
    getBlueprintsDataByUri: (uri: string) => IBlueprintDescriptor;
    changeBlueprintType: (uri: string, type: BlueprintType) => void;
    createNodeById: (uri: string, id: string, posX: number, posY: number) => void;
    updatedNodePosition: (uri: string, uuid: string, movementX: number, movementY: number) => void;
    updateNodeData: (uri: string, uuid: string, data: any) => void;
    removeNode: (uri: string, uuid: string) => void;
    moveNodeToFront: (uri: string, uuid: string) => void;
    moveNodeToBack: (uri: string, uuid: string) => void;
    createLink: (uri: string, pipelineLink: IBlueprintPipelineLink) => void;
    removeLink: (uri: string, uuid: string) => void;
}
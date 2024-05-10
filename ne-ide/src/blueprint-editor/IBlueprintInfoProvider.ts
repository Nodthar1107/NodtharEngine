import { IEventEmitterProvider } from '../core/utils/events/IEventEmitterProvider';
import { IBlueprintBlockDescriptor, IBlueprintDescriptor, IBlueprintPipelineLink } from './model';
import { BlueprintEditorEvents } from './events';

export interface IBlueprintsInfoProvider extends IEventEmitterProvider<BlueprintEditorEvents> {
    getBlueprintsLibrary: () => IBlueprintBlockDescriptor[];
    getBlueprintsDataByUri: (uri: string) => IBlueprintDescriptor;
    createNodeById: (uri: string, id: string, posX: number, posY: number) => void;
    updatedNodePosition: (uri: string, uuid: string, movementX: number, movementY: number) => void;
    removeNode: (uri: string, uuid: string) => void;
    moveNodeToFront: (uri: string, uuid: string) => void;
    moveNodeToBack: (uri: string, uuid: string) => void;
    createLink: (uri: string, pipelineLink: IBlueprintPipelineLink) => void;
    removeLink: (uri: string, uuid: string) => void;
}
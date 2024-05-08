import { IEventEmitterProvider } from '../core/utils/events/IEventEmitterProvider';
import { IBlueprintDescriptor, IBlueprintNode } from './model';
import { BlueprintEditorEvents } from './events';

export interface IBlueprintsInfoProvider extends IEventEmitterProvider<BlueprintEditorEvents> {
    getBlueprintsLibrary: () => IBlueprintDescriptor[];
    getBlueprintsNodesByUri: (uri: string) => IBlueprintNode[];
    createNodeById: (uri: string, id: string, posX: number, posY: number) => void;
    updatedNodePosition: (uri: string, uuid: string, posX: number, posY: number) => void;
    removeNode: (uri: string, uuid: string) => void;
    moveNodeToFront: (uri: string, uuid: string) => void;
    moveNodeToBack: (uri: string, uuid: string) => void;
}
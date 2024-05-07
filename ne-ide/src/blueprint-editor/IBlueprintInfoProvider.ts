import { IBlueprintDescriptor, IBlueprintNode } from './model';

export interface IBlueprintsInfoProvider {
    getBlueprintsLibrary: () => IBlueprintDescriptor[];
    getBlueprintsNodes: (uri: string) => IBlueprintNode[];
    createNodeById: (id: string) => IBlueprintNode;
}
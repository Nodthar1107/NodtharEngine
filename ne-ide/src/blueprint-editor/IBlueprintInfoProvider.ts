import { IBlueprintDescriptor } from "./model";

export interface IBlueprintsInfoProvider {
    getBlueprintsDescriptors: () => IBlueprintDescriptor[];
}
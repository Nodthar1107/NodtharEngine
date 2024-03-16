import { IHierarchyItem } from "../items/IHierarchyItem";

export interface ITreeViewManager {
    getSceneHierarchy(sceneId: string): IHierarchyItem;
}
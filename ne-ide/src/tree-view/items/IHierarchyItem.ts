import * as React from "react";
import { IHierarchyItemDto } from "../TreeViewManager/IHierarchyItemDto";

export interface IHierarchyItem extends Omit<Omit<IHierarchyItemDto, 'iconId'>, 'children'> {
    children?: IHierarchyItem[];
    
    icon?: React.FC;
}
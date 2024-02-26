import { IActivityBarDescriptor } from "./IActivityBarItemDescriptor";

export interface IActivityBarItem extends IActivityBarDescriptor {
    toggled: boolean;
    handler: () => void;
}
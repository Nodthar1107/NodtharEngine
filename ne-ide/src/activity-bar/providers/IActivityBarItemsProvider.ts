import { IActivityBarItemDescriptor } from '../items/IActivityBarItemDescriptor';

export interface IActivityBarItemsProvider {
    getItems: () => IActivityBarItemDescriptor[];
}
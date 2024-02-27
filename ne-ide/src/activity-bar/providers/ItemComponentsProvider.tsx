import { inject, injectable } from 'inversify';
import * as React from 'react';

import { IActivityBarItemDescriptor } from '../items/IActivityBarItemDescriptor';
import { IActivityBarItemsProvider } from './IActivityBarItemsProvider';
import { ActivityBarItemsGroup } from '../items/ActivityBarItemsGroup';
import { ActivityBarItem } from '../items/ActivityBarItem';
import { IconsProvider } from '../../core/providers/IconsProvider';
import { IIconProps } from '../../core/icons/IIconProps';
import { IItemComponentsProvider } from './IItemComponentsProvider';
import { ACTIVITY_BAR_TYPES } from '../module-types';
import { CORE_TYPES } from '../../core/module-types';

import 'reflect-metadata';

@injectable()
export class ItemsComponentsProvider implements IItemComponentsProvider {
    @inject(ACTIVITY_BAR_TYPES.IActivityBarItemsProvider) private itemsProvider!: IActivityBarItemsProvider;
    @inject(CORE_TYPES.IIconsProvider) private iconsProvider!: IconsProvider

    public getItems(): React.ReactElement[] {
        const descriptors = this.itemsProvider.getItems().sort();

        const groupedDescriptors = descriptors.reduce<Map<string, number[]>>(
            (constructedMap: Map<string, number[]>, descriptor: IActivityBarItemDescriptor, index: number) => {
                const commandGroup = this.getCommandGroup(descriptor.category);
                if (!constructedMap.has(commandGroup)) {
                    constructedMap.set(commandGroup, []);
                }

                constructedMap.get(commandGroup)?.push(index);
                
                return constructedMap;
            },
            new Map()
        );

        return this.getComponentsBySortedMap(descriptors, groupedDescriptors);
    }

    private getComponentsBySortedMap(
        descriptors: IActivityBarItemDescriptor[],
        groupedDescriptors: Map<string, number[]>
    ): React.ReactElement[] {
        return Array.from(groupedDescriptors.entries()).map(
            (entry: [string, number[]]) => {
                const [_, indexes] = entry;

                if (indexes.length !== 1) {
                    return (
                        <ActivityBarItemsGroup>
                            {indexes.map((descriptorIndex: number) => {
                                return this.getActivityBarItemComponent(descriptors[descriptorIndex]);
                            })}
                        </ActivityBarItemsGroup>
                    );
                }

                return this.getActivityBarItemComponent(descriptors[indexes[0]]);
            }
        );
    }

    private getActivityBarItemComponent(descriptor: IActivityBarItemDescriptor): React.ReactElement {
        return (
            <ActivityBarItem
                command={descriptor}
                icon={React.createElement<IIconProps>(this.iconsProvider.getIconById(descriptor.iconId))}
                onActivate={() => {}}
            />
        );
    }

    private getCommandGroup(category: string): string {
        return category.substring(0, category.indexOf('@'));
    }
}

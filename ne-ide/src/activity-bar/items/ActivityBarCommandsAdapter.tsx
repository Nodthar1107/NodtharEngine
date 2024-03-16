import { inject, injectable } from 'inversify';
import * as React from 'react';

import { ActivityBarItemsGroup } from './ActivityBarItemsGroup';
import { ActivityBarItem } from './ActivityBarItem';
import { IIconProps } from '../../core/icons/IIconProps';
import { ICommandDescriptor } from 'src/core/providers/commandsProvider/ICommandDescriptor';

export class ActivityBarCommandsAdapter {
    public getItems(descriptors: ICommandDescriptor[]): React.ReactElement[] {
        const groupedDescriptors = descriptors.reduce<Map<string, number[]>>(
            (constructedMap: Map<string, number[]>, descriptor: ICommandDescriptor, index: number) => {
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
        descriptors: ICommandDescriptor[],
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

    private getActivityBarItemComponent(descriptor: ICommandDescriptor): React.ReactElement {
        return (
            <ActivityBarItem
                command={descriptor}
                icon={descriptor.icon && React.createElement<IIconProps>(descriptor.icon)}
                onActivate={() => {}}
            />
        );
    }

    private getCommandGroup(category: string): string {
        return category.substring(0, category.indexOf('@'));
    }
}

import * as React from 'react';

import { ActivityBarItemsGroup } from './ActivityBarItemsGroup';
import { ActivityBarItem } from './ActivityBarItem';
import { ICommand } from 'src/core/providers/commandsProvider/commands';

export class ActivityBarCommandsAdapter {
    public getItems(commands: ICommand[]): React.ReactElement[] {
        const groupedCommands = commands.reduce<Map<string, number[]>>(
            (constructedMap: Map<string, number[]>, descriptor: ICommand, index: number) => {
                const commandGroup = this.getCommandGroup(descriptor.category || '');
                if (!constructedMap.has(commandGroup)) {
                    constructedMap.set(commandGroup, []);
                }

                constructedMap.get(commandGroup)?.push(index);
                
                return constructedMap;
            },
            new Map()
        );

        return this.getComponentsBySortedMap(commands, groupedCommands);
    }

    private getComponentsBySortedMap(
        commands: ICommand[],
        groupedCommands: Map<string, number[]>
    ): React.ReactElement[] {
        return Array.from(groupedCommands.entries()).map(
            (entry: [string, number[]]) => {
                const [_, indexes] = entry;

                if (indexes.length !== 1) {
                    return (
                        <ActivityBarItemsGroup>
                            {indexes.map((commandIndex: number) => {
                                return this.getActivityBarItemComponent(commands[commandIndex]);
                            })}
                        </ActivityBarItemsGroup>
                    );
                }

                return this.getActivityBarItemComponent(commands[indexes[0]]);
            }
        );
    }

    private getActivityBarItemComponent(command: ICommand): React.ReactElement {
        return (
            <ActivityBarItem
                command={command}
                icon={command.iconComponent && React.createElement(command.iconComponent)}
                onActivate={() => {}}
            />
        );
    }

    private getCommandGroup(category: string): string {
        return category.substring(0, category.indexOf('@'));
    }
}

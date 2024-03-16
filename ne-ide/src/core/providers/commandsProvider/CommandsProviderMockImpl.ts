import { inject, injectable } from 'inversify';
import { ICommandDescriptor } from './ICommandDescriptor';
import { ICommandDto } from './ICommandDto';
import { ICommandsProvider } from './ICommandsProvider';
import { IIconsProvider } from '../IIconsProvider';
import { IconsProvider } from '../IconsProvider';
import { CORE_TYPES } from '../../module-types';

import 'reflect-metadata';

@injectable()
export class CommandsProviderMockImpl implements ICommandsProvider {
    private iconsProvider: IIconsProvider;

    constructor(@inject(CORE_TYPES.IIconsProvider) iconsProvier: IconsProvider) {
        this.iconsProvider = iconsProvier;
    }

    public getCommandsByContext(context: string): ICommandDescriptor[] {
        const commands: ICommandDto[] = [
            {
                title: 'Перемещение',
                id: 'transform-commands.move',
                context: 'activity-bar', 
                category: '1transform@1$group',
                iconId: 'move-object'
            },
            {
                title: 'Вращение',
                id: 'activity-bar.rotate',
                context: 'activity-bar', 
                category: '1transform@2$group',
                iconId: 'rotate-object'
            },
            {
                title: 'Масштабирование',
                id: 'activity-bar.scale',
                context: 'activity-bar',
                category: '1transform@3$group',
                iconId: 'scale-object' 
            },
            {
                title: 'Сфокусироваться',
                id: 'activity-bar.focus',
                context: 'activity-bar',
                category: '2scene-manipulation',
                iconId: 'focus-on-object' 
            },
            {
                title: 'Отменить команду',
                id: 'activity-bar.undo',
                context: 'activity-bar',
                category: '3operations-performing@1',
                iconId: 'undo-operation' 
            },
            {
                title: 'Восстановить команду',
                id: 'activity-bar.redo',
                context: 'activity-bar',
                category: '3operations-performing@2',
                iconId: 'redo-operation' 
            }
        ]
            
        return commands.filter((command: ICommandDto) => command.context === context )
            .map<ICommandDescriptor>((command: ICommandDto) => {
                return {
                    ...command,
                    icon: this.iconsProvider.getIconById(command.iconId)
                }
            });
    }
}
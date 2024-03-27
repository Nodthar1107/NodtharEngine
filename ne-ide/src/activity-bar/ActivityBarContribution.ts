import { ICommandRegister } from '../core/providers/commandsProvider/ICommandRegister';
import { ICommandContribution } from '../core/providers/commandsProvider/ICommandContribution';
import { injectable } from 'inversify';

import 'reflect-metadata';

@injectable()
export class ActivityBarContribution implements ICommandContribution {
    public registerCommands(register: ICommandRegister) {
        register.registerCommand({
            title: 'Перемещение',
            id: 'transform-commands.move',
            context: 'activity-bar',
            category: '1transform@1$group',
            iconId: 'move-object'
        });
        register.registerCommand({
            title: 'Вращение',
            id: 'activity-bar.rotate',
            context: 'activity-bar',
            category: '1transform@2$group',
            iconId: 'rotate-object'
        });
        register.registerCommand({
            title: 'Масштабирование',
            id: 'activity-bar.scale',
            context: 'activity-bar',
            category: '1transform@3$group',
            iconId: 'scale-object'
        });
        register.registerCommand({
            title: 'Сфокусироваться',
            id: 'activity-bar.focus',
            context: 'activity-bar',
            category: '2scene-manipulation',
            iconId: 'focus-on-object'
        });
        register.registerCommand({
            title: 'Отменить команду',
            id: 'activity-bar.undo',
            context: 'activity-bar',
            category: '3operations-performing@1',
            iconId: 'undo-operation'
        });
        register.registerCommand({
            title: 'Восстановить команду',
            id: 'activity-bar.redo',
            context: 'activity-bar',
            category: '3operations-performing@2',
            iconId: 'redo-operation'
        });
    }
}
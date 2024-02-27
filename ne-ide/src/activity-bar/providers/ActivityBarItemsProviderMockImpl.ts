import { injectable } from 'inversify';
import { IActivityBarItemDescriptor } from '../items/IActivityBarItemDescriptor';
import { IActivityBarItemsProvider } from './IActivityBarItemsProvider';

import 'reflect-metadata';

@injectable()
export class ActivityBarItemsProviderMockImpl implements IActivityBarItemsProvider {
    public getItems(): IActivityBarItemDescriptor[] {
        return [
            {
                title: 'Перемещение',
                id: 'transform-commands.move',
                alter: 'Move',
                category: '1transform@1$group',
                iconId: 'move-object' 
            },
            {
                title: 'Вращение',
                id: 'activity-bar.rotate',
                alter: 'Rotate',
                category: '1transform@2$group',
                iconId: 'rotate-object'
            },
            {
                title: 'Масштабирование',
                id: 'activity-bar.scale',
                alter: 'Scale',
                category: '1transform@3$group',
                iconId: 'scale-object' 
            },
            {
                title: 'Сфокусироваться',
                id: 'activity-bar.focus',
                alter: 'Focus',
                category: '2scene-manipulation',
                iconId: 'focus-on-object' 
            },
            {
                title: 'Отменить команду',
                id: 'activity-bar.undo',
                alter: 'Undo',
                category: '3operations-performing@1',
                iconId: 'undo-operation' 
            },
            {
                title: 'Восстановить команду',
                id: 'activity-bar.redo',
                category: '3operations-performing@2',
                iconId: 'redo-operation' 
            }
        ];
    }
}

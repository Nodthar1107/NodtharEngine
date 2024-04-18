import { inject, injectable } from 'inversify';
import { ICommandContribution } from '../core/providers/commandsProvider/ICommandContribution';
import { ICommandRegister } from '../core/providers/commandsProvider/ICommandRegister';

import 'reflect-metadata';
import { IResourcesManager } from './ResourcesManager/IResourcesManager';
import { FILES_EXPLORER_MODULE } from './module-types';
import { generateFolder } from './ResourcesManager/resourceUtils';

@injectable()
export class FilesExplorerCommandsContribution implements ICommandContribution {
    private resourceManager: IResourcesManager;
    
    public constructor(
        @inject(FILES_EXPLORER_MODULE.IResourcesManager) resourceManager: IResourcesManager
    ) {
        this.resourceManager = resourceManager;
    }

    public registerCommands(register: ICommandRegister) {
        register.registerCommand({
            id: 'filesExplorer.content.openDialog.createNewResource',
            context: 'files-explorer-context',
            title: 'Добавить ресурс',
            iconId: 'add',
            execute: () => {
                this.resourceManager.addResourceToCurrentFolder(generateFolder('Новая папка'));
            }
        });

        register.registerCommand({
            id: 'filesExplorer.TreeView.openTopLevelFolder',
            context: 'files-explorer-context',
            title: 'Перейти в родительскую папку',
            iconId: 'back',
            isEnable: () => {
                return true;
            },
            execute: () => {
                const folder = this.resourceManager.getCurrentFolder();
                if (folder === undefined || folder.parent === null) {
                    return;
                }

                this.resourceManager.setCurrentDirectory(folder.parent.uri);
            }
        });

        register.registerCommand({
            id: 'filesExplorer.treeView.element.copy',
            context: 'tree-view-context',
            category: '1crud-operation@1',
            title: 'Копировать',
            execute: (resourceUri: string) => {
                
            }
        });

        register.registerCommand({
            id: 'filesExplorer.treeView.element.rename',
            context: 'tree-view-context',
            title: 'Переименовать',
            category: '1crud-operation@2',
            execute: (resourceUri: string) => {
                
            }
        });

        register.registerCommand({
            id: 'filesExplorer.treeView.element.remove',
            context: 'tree-view-context',
            category: '1crud-operation@3',
            title: 'Удалить',
            execute: (resourceUri: string) => {
                
            }
        });
    }
}
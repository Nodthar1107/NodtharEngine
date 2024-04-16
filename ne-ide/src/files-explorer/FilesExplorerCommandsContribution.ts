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
            id: 'filesExplorer.openDialog.createNewResource',
            context: 'files-explorer-context',
            title: 'Добавить ресурс',
            iconId: 'add',
            execute: () => {
                this.resourceManager.addResourceToCurrentFolder(generateFolder('Новая папка'));
            }
        });

        register.registerCommand({
            id: 'filesExplorer.openTopLevelFolder',
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
        })
    }

}
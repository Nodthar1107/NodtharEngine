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
                this.resourceManager.addResourceToCurrentFolder(generateFolder('Новая папка'))
            }
        })
    }

}
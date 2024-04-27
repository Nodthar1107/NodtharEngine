import { inject, injectable } from 'inversify';
import { ICommandContribution } from '../core/providers/commandsProvider/ICommandContribution';
import { ICommandRegister } from '../core/providers/commandsProvider/ICommandRegister';
import { IResourcesManager } from './ResourcesManager/IResourcesManager';
import { FILES_EXPLORER_MODULE } from './module-types';
import { generateFolder } from './ResourcesManager/resourceUtils';
import { IDialogService } from '../core/services/DialogService/IDialogService';
import { IMessageService } from '../core/services/MessageService/MessageService';
import { CORE_TYPES } from '../core/module-types';

import 'reflect-metadata';

@injectable()
export class FilesExplorerCommandsContribution implements ICommandContribution {
    private resourceManager: IResourcesManager;
    private dialogService: IDialogService;
    private messageService: IMessageService;
    
    public constructor(
        @inject(FILES_EXPLORER_MODULE.IResourcesManager) resourceManager: IResourcesManager,
        @inject(CORE_TYPES.IDialogService) dialogService: IDialogService,
        @inject(CORE_TYPES.IMessageService) messageService: IMessageService
    ) {
        this.resourceManager = resourceManager;
        this.dialogService = dialogService;
        this.messageService = messageService;
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
            execute: async (resourceUri: string) => {
                if (resourceUri === '/') {
                    this.messageService.showInfoMessage({
                        title: 'Нельзя переименовать',
                        description: 'Корневая директория не может быть переименована'
                    });

                    return;
                }

                const label = await this.dialogService.showInputDialog({
                    title: 'Переименование папки',
                    description: 'Введите имя папки и нажмите Enter'
                });

                if (label !== '') {
                    this.resourceManager.renameElement(resourceUri, label);
                }
            }
        });

        register.registerCommand({
            id: 'filesExplorer.treeView.element.remove',
            context: 'tree-view-context',
            category: '1crud-operation@3',
            title: 'Удалить',
            execute: (resourceUri: string) => {
                if (resourceUri === '/') {
                    this.messageService.showInfoMessage({
                        title: 'Нельзя удалить',
                        description: 'Корневая директория не может быть удалена какой-то длинный текст сообщения ради проверки длинных сообщений'
                    });

                    return;
                }
                
                if (resourceUri) {
                    this.resourceManager.removeResourceByUri(resourceUri);
                } 
            }
        });
    }
}
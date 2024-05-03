import { inject, injectable } from 'inversify';
import { ICommandContribution } from '../core/providers/commandsProvider/ICommandContribution';
import { ICommandRegister } from '../core/providers/commandsProvider/ICommandRegister';
import { IResourcesManager } from './ResourcesManager/IResourcesManager';
import { FILES_EXPLORER_MODULE } from './module-types';
import { generateFolder, generateResource } from './ResourcesManager/resourceUtils';
import { IDialogService } from '../core/services/DialogService/IDialogService';
import { IMessageService } from '../core/services/MessageService/MessageService';
import { CORE_TYPES } from '../core/module-types';
import { URI } from '../core/utils/URI';

import 'reflect-metadata';
import { IQuickInputItem } from 'src/core/services/DialogService/QuickInputDialog';
import { ResourceType } from './ResourcesManager/ResourceType';

const DOWNLOAD_FROM_FS = 'download-from-fs';

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
        this.registerToolbarCommands(register);
        this.registerTreeViewElementCommands(register);
        this.registerResourceWidgetCommands(register)
        this.registerFolderContentPanelContext(register);
    }

    private registerToolbarCommands(register: ICommandRegister) {
        register.registerCommand({
            id: 'filesExplorer.content.openDialog.createNewResource',
            context: 'files-explorer-toolbar',
            title: 'Добавить папку',
            iconId: 'add',
            execute: this.createNewResource.bind(this)
        });

        register.registerCommand({
            id: 'filesExplorer.TreeView.openTopLevelFolder',
            context: 'files-explorer-toolbar',
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
    }

    private registerTreeViewElementCommands(register: ICommandRegister) {
        register.registerCommand({
            id: 'filesExplorer.treeView.element.copy',
            context: 'files-explorer-tree-view-element-context',
            category: '1crud-operation@1',
            title: 'Копировать',
            execute: (resourceUri: string) => {
                
            }
        });

        register.registerCommand({
            id: 'filesExplorer.treeView.element.rename',
            context: 'files-explorer-tree-view-element-context',
            title: 'Переименовать',
            category: '1crud-operation@2',
            execute: async (resourceUri: string) => {
                this.renameProjectElement(resourceUri);
            }
        });

        register.registerCommand({
            id: 'filesExplorer.treeView.element.remove',
            context: 'files-explorer-tree-view-element-context',
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
                    this.resourceManager.removeResourceByUri(URI.createURIFromString(resourceUri));
                } 
            }
        });
    }

    private registerResourceWidgetCommands(register: ICommandRegister) {
        register.registerCommand({
            id: 'filesExplorer.folderContentPanel.copyElement',
            context: 'files-explorer-resource-widget-context',
            title: 'Копировать'
        });

        register.registerCommand({
            id: 'filesExplorer.folderContentPanel.renameElement',
            context: 'files-explorer-resource-widget-context',
            title: 'Переименовать',
            execute: (uri: string) => {
                this.renameProjectElement(uri);
            },
        });

        register.registerCommand({
            id: 'filesExplorer.folderContentPanel.removeElement',
            context: 'files-explorer-resource-widget-context',
            title: 'Удалить',
        });

        register.registerCommand({
            id: 'filesExplorer.folderContentPanel.showElementProperties',
            context: 'files-explorer-resource-widget-context',
            title: 'Свойства',
        });
    }

    private registerFolderContentPanelContext(register: ICommandRegister) {
        register.registerCommand({
            id: 'filesExplorer.folderContentPanel.addElement',
            context: 'files-explorer-folders-content-panel',
            title: 'Создать элемент проекта',
        });
    }

    private async renameProjectElement(uri: string) {
        if (uri === '/') {
            this.messageService.showInfoMessage({
                title: 'Нельзя переименовать',
                description: 'Корневая директория не может быть переименована'
            });

            return;
        }

        const label = await this.dialogService.showInputDialog({
            title: 'Переименование элемента проекта'
        });

        if (label) {
            this.resourceManager.renameElement(URI.createURIFromString(uri), label);
        }
    }

    private async createNewResource() {
        const item = await this.dialogService.showQuickInputDialog({
            items: createNewResourceDialogItems,
            title: 'Создание ресурса проекта',
            hideInput: true
        });

        if (item) {
            switch (item.meta) {
                case ResourceType.Folder:
                    this.createNewFolder();

                    return;
                case ResourceType. Blueprint:
                    this.createNewBluePrint();

                    return;
                case DOWNLOAD_FROM_FS:
            }
        }
    }

    private async createNewFolder() {
        const label = await this.dialogService.showInputDialog({
            title: 'Введите имя директории',
        })

        if (label) {
            this.resourceManager.addResourceToCurrentFolder(generateFolder(label));
        }
    }

    private async createNewBluePrint() {
        const label = await this.dialogService.showInputDialog({
            title: 'Введите имя директории',
        })

        if (label) {
            this.resourceManager.addResourceToCurrentFolder(generateResource(label, ResourceType.Blueprint));
        }
    }
}

const createNewResourceDialogItems: IQuickInputItem[] = [
    {
        label: 'Дирекория',
        description: 'Тестовое описание',
        meta: ResourceType.Folder
    },
    {
        label: 'Визуальный сценарий',
        meta: ResourceType.Blueprint
    },
    {
        label: 'Загрузить из файловой системы',
        meta: DOWNLOAD_FROM_FS
    }
];

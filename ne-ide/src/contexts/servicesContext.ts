import * as React from 'react';
import { IIconsProvider } from '../core/providers/IIconsProvider';
import { ICommandsProvider } from '../core/providers/commandsProvider/ICommandsProvider';
import { ITreeViewManager } from '../tree-view/TreeViewManager/ITreeViewManager';
import { IResourcesManager } from '../files-explorer/ResourcesManager/IResourcesManager';
import { IDialogService } from 'src/core/services/DialogService/IDialogService';
import { IMessageService } from 'src/core/services/MessageService/MessageService';

const InitialContex = {
    commandsProvider: {} as ICommandsProvider,
    iconsProvider: {} as IIconsProvider,
    treeViewManager: {} as ITreeViewManager,
    resourcesManager: {} as IResourcesManager,
    dialogService: {} as IDialogService,
    messageService: {} as IMessageService
};

export type ProvidersContextType = typeof InitialContex;

export const ProvidersContext = React.createContext<ProvidersContextType>(InitialContex);

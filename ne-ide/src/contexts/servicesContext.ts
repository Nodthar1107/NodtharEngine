import * as React from 'react';
import { IIconsProvider } from '../core/providers/IIconsProvider';
import { ICommandsProvider } from '../core/providers/commandsProvider/ICommandsProvider';
import { ITreeViewManager } from '../tree-view/TreeViewManager/ITreeViewManager';
import { IResourcesManager } from '../files-explorer/ResourcesManager/IResourcesManager';
import { IDialogService } from 'src/core/services/DialogService/IDialogService';

const InitialContex = {
    commandsProvider: {} as ICommandsProvider,
    iconstProvider: {} as IIconsProvider,
    treeViewManager: {} as ITreeViewManager,
    resourcesManager: {} as IResourcesManager,
    dialogService: {} as IDialogService
};

export type ProvidersContextType = typeof InitialContex;

export const ProvidersContext = React.createContext<ProvidersContextType>(InitialContex);

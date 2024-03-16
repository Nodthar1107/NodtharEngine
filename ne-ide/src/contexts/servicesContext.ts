import * as React from 'react';
import { IIconsProvider } from '../core/providers/IIconsProvider';
import { ICommandsProvider } from '../core/providers/commandsProvider/ICommandsProvider';
import { ITreeViewManager } from 'src/tree-view/TreeViewManager/ITreeViewManager';

const InitialContex = {
    commandsProvider: {} as ICommandsProvider,
    iconstProvider: {} as IIconsProvider,
    treeViewManager: {} as ITreeViewManager
};

export type ProvidersContextType = typeof InitialContex;

export const ProvidersContext = React.createContext<ProvidersContextType>(InitialContex);

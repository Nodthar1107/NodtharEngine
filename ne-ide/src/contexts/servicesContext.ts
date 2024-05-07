import * as React from 'react';
import { IIconsProvider } from '../core/providers/IIconsProvider';
import { ICommandsProvider } from '../core/providers/commandsProvider/ICommandsProvider';
import { ITreeViewManager } from '../tree-view/TreeViewManager/ITreeViewManager';
import { IResourcesManager } from '../files-explorer/ResourcesManager/IResourcesManager';
import { IDialogService } from '../core/services/DialogService/IDialogService';
import { IMessageService } from '../core/services/MessageService/MessageService';
import { IEditorsManager } from '../editor-viewer/managers/IEditorsManager';
import { IEditorRendererProviderService } from '../editor-viewer/EditorRenderers/EditorRendererProvider';
import { IBlueprintsInfoProvider } from '../blueprint-editor/IBlueprintInfoProvider';

const InitialContex = {
    commandsProvider: {} as ICommandsProvider,
    iconsProvider: {} as IIconsProvider,
    treeViewManager: {} as ITreeViewManager,
    resourcesManager: {} as IResourcesManager,
    dialogService: {} as IDialogService,
    messageService: {} as IMessageService,
    editorsManager: {} as IEditorsManager,
    editorRendererProviderService: {} as IEditorRendererProviderService,
    blueprintsInfoProvider: {} as IBlueprintsInfoProvider
};

export type ProvidersContextType = typeof InitialContex;

export const ProvidersContext = React.createContext<ProvidersContextType>(InitialContex);

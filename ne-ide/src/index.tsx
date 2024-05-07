import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Container } from 'inversify';

import { App } from './App';
import { CoreModule } from './core/module';
import { IDIModule } from './core/dependencies/IDIModule';
import { CORE_TYPES } from './core/module-types';
import { ProvidersContext } from './contexts/servicesContext';
import { ICommandsProvider } from './core/providers/commandsProvider/ICommandsProvider';
import { IIconsProvider } from './core/providers/IIconsProvider';
import { ITreeViewManager } from './tree-view/TreeViewManager/ITreeViewManager';
import { TREE_VIEW_MODULE } from './tree-view/module-types';
import { TreeViewModule } from './tree-view/module';
import { FilesExplorerModule } from './files-explorer/module';
import { IResourcesManager } from './files-explorer/ResourcesManager/IResourcesManager';
import { FILES_EXPLORER_MODULE } from './files-explorer/module-types';
import { ActivityBarModule } from './activity-bar/module';
import { IDialogService } from './core/services/DialogService/IDialogService';
import { IMessageService } from './core/services/MessageService/MessageService';
import { EditorViewerModule } from './editor-viewer/module';
import { IEditorsManager } from './editor-viewer/managers/IEditorsManager';
import { EDITOR_VIEWER_MODULE } from './editor-viewer/module-types';
import { IEditorRendererProviderService } from './editor-viewer/EditorRenderers/EditorRendererProvider';
import { BlueprintModule } from './blueprint-editor/module';

import 'reflect-metadata';
import { IBlueprintsInfoProvider } from './blueprint-editor/IBlueprintInfoProvider';
import { BLUEPRINT_EDITOR_MODULE } from './blueprint-editor/module-types';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const injector = new Container();

[
    new CoreModule(),
    new TreeViewModule(),
    new FilesExplorerModule(),
    new ActivityBarModule(),
    new EditorViewerModule(),
    new BlueprintModule()
].forEach((module: IDIModule) => {
    module.registerModule(injector);
});

root.render(
    <React.StrictMode>
        <ProvidersContext.Provider
            value={{
                commandsProvider: injector.get<ICommandsProvider>(CORE_TYPES.ICommandsProvider),
                iconsProvider: injector.get<IIconsProvider>(CORE_TYPES.IIconsProvider),
                treeViewManager: injector.get<ITreeViewManager>(TREE_VIEW_MODULE.ITreeViewManager),
                resourcesManager: injector.get<IResourcesManager>(FILES_EXPLORER_MODULE.IResourcesManager),
                dialogService: injector.get<IDialogService>(CORE_TYPES.IDialogService),
                messageService: injector.get<IMessageService>(CORE_TYPES.IMessageService),
                editorsManager: injector.get<IEditorsManager>(EDITOR_VIEWER_MODULE.IEditorManager),
                editorRendererProviderService: injector.get<IEditorRendererProviderService>(EDITOR_VIEWER_MODULE.IEditorRendererProviderService),
                blueprintsInfoProvider: injector.get<IBlueprintsInfoProvider>(BLUEPRINT_EDITOR_MODULE.IBlueprintsInfoProvider)
            }}>
            <App />
        </ProvidersContext.Provider>
    </React.StrictMode>
);

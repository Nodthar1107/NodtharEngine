import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { App } from './App';
import { Container } from 'inversify';
import { CoreModule } from './core/module';
import { IDIModule } from './core/dependencies/IDIModule';
import { CORE_TYPES } from './core/module-types';
import { ProvidersContext } from './contexts/servicesContext';
import { ICommandsProvider } from './core/providers/commandsProvider/ICommandsProvider';
import { IIconsProvider } from './core/providers/IIconsProvider';

import 'reflect-metadata';
import { ITreeViewManager } from './tree-view/TreeViewManager/ITreeViewManager';
import { TREE_VIEW_MODULE } from './tree-view/module-types';
import { TreeViewModule } from './tree-view/module';
import { FilesExplorerModule } from './files-explorer/module';
import { IResourcesManager } from './files-explorer/ResourcesManager/IResourcesManager';
import { FILES_EXPLORER_MODULE } from './files-explorer/module-types';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const injector = new Container();

[new CoreModule(), new TreeViewModule(), new FilesExplorerModule()].forEach((module: IDIModule) => {
    module.registerModule(injector);
});

root.render(
    <React.StrictMode>
        <ProvidersContext.Provider
            value={{
                commandsProvider: injector.get<ICommandsProvider>(CORE_TYPES.ICommandsProvider),
                iconstProvider: injector.get<IIconsProvider>(CORE_TYPES.IIconsProvider),
                treeViewManager: injector.get<ITreeViewManager>(TREE_VIEW_MODULE.ITreeViewManager),
                resourcesManager: injector.get<IResourcesManager>(FILES_EXPLORER_MODULE.IResourcesManager)
            }}>
            <App />
        </ProvidersContext.Provider>
    </React.StrictMode>
);

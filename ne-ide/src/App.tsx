import * as React from 'react';

import { ActivityBarPanel } from './activity-bar';
import { FilesExplorerPanel } from './files-explorer/FilesExplorer';
import { PropertyViewPanel } from './properties-view';
import { TreeViewPanel } from './tree-view';

import { DialogServiceRenderer } from './core/services/DialogService/DialogServiceRenderer';
import { ProvidersContext } from './contexts/servicesContext';
import { MessageServiceRenderer } from './core/services/MessageService/MessageServiceRenderer';
import { EditorViewer } from './editor-viewer';
import { ConnectionStatusPanel } from './connection-status/ConnectionStatusPanel';

import './style.css';

export const App: React.FC = (): React.ReactElement => {
    const dialogService = React.useContext(ProvidersContext).dialogService;
    const commandsProvider = React.useContext(ProvidersContext).commandsProvider;
    const iconsProvider = React.useContext(ProvidersContext).iconsProvider;
    const messageService = React.useContext(ProvidersContext).messageService;
    const editorsManager = React.useContext(ProvidersContext).editorsManager;
    const editorRendererProvider = React.useContext(ProvidersContext).editorRendererProviderService;
    const serverDispacther = React.useContext(ProvidersContext).serverDispatcher;

    return (
        <div className='NodtharEngine'>
            <div className='layout'>
                <div className='working-space'>
                    <ActivityBarPanel />
                    <TreeViewPanel title='Иерархия' useVerticalAlign />
                    <div className='main-section' style={{ minWidth: '10%' }}>
                        <EditorViewer editorRenderer={editorRendererProvider} editorManager={editorsManager}  />
                        <FilesExplorerPanel title='Проводник' />
                    </div>
                    <PropertyViewPanel title='Свойства' useVerticalAlign />
                </div>
                <ConnectionStatusPanel serverDispatcher={serverDispacther} messageService={messageService} />
            </div>
            <DialogServiceRenderer dialogService={dialogService} commandService={commandsProvider} />
            <MessageServiceRenderer iconProvider={iconsProvider} messageService={messageService} />
        </div>
    );
}

import * as React from 'react';

import { ActivityBarPanel } from './activity-bar';
import { FilesExplorerPanel } from './files-explorer/FilesExplorer';
import { PropertyViewPanel } from './properties-view';
import { TreeViewPanel } from './tree-view';

import './style.css';
import { DialogServiceRenderer } from './core/services/DialogService/DialogServiceRenderer';
import { ProvidersContext } from './contexts/servicesContext';
import { MessageService } from './core/services/MessageService/MessageService';
import { MessageServiceRenderer } from './core/services/MessageService/MessageServiceRenderer';
import { EditorViewer } from './editor-viewer';

export const App: React.FC = (): React.ReactElement => {
    const dialogService = React.useContext(ProvidersContext).dialogService;
    const commandsProvider = React.useContext(ProvidersContext).commandsProvider;
    const iconsProvider = React.useContext(ProvidersContext).iconsProvider;
    const messageService = React.useContext(ProvidersContext).messageService;
    const editorsManager = React.useContext(ProvidersContext).editorsManager;

    return (
        <div className='NodtharEngine'>
            <ActivityBarPanel />
            <TreeViewPanel title='Иерархия' useVerticalAlign />
            <div className='main-section' style={{ minWidth: '10%' }}>
                <EditorViewer editorManager={editorsManager} />
                <FilesExplorerPanel title='Проводник' />
            </div>
            <PropertyViewPanel title='Свойства' useVerticalAlign />
            <DialogServiceRenderer dialogService={dialogService} commandService={commandsProvider} />
            <MessageServiceRenderer iconProvider={iconsProvider} messageService={messageService} />
        </div>
    );
}

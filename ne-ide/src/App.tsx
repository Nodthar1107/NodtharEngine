import * as React from 'react';

import { ActivityBarPanel } from './activity-bar';
import { FilesExplorerPanel } from './files-explorer/FilesExplorer';
import { PropertyViewPanel } from './properties-view';
import { TreeViewPanel } from './tree-view';

import './style.css';
import { DialogServiceRenderer } from './core/services/DialogService/DialogServiceRenderer';
import { ProvidersContext } from './contexts/servicesContext';

export const App: React.FC = (): React.ReactElement => {
    const dialogService = React.useContext(ProvidersContext).dialogService;
    const commandsProvider = React.useContext(ProvidersContext).commandsProvider;

    return (
        <div className='NodtharEngine'>
            <ActivityBarPanel />
            <TreeViewPanel title='Иерархия' useVerticalAlign />
            <div className='main-section' style={{ minWidth: '10%' }}>
                <div className='viewport' style={{ flex: '1 1 auto', minHeight: '10%' }}>
                </div>
                <FilesExplorerPanel title='Проводник' />
            </div>
            <PropertyViewPanel title='Свойства' useVerticalAlign />
            <DialogServiceRenderer dialogService={dialogService} commandService={commandsProvider} />
        </div>
    );
}

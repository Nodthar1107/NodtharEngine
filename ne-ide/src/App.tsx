import * as React from 'react';

import { ActivityBarPanel } from './activity-bar';
import { FilesExplorerPanel } from './files-explorer/FilesExplorer';
import { PropertyViewPanel } from './properties-view';
import { TreeViewPanel } from './tree-view';

import './style.css';

export const App: React.FC = (): React.ReactElement => {
    return (
        <div className='NodtharEngine'>
            <ActivityBarPanel />
            <TreeViewPanel title='Иерархия' useVerticalAlign />
            <div className='main-section' style={{ minWidth: '10%' }}>
                <div className='viewport' style={{ flex: '1 1 auto', minHeight: '10%' }}></div>
                <FilesExplorerPanel title='Проводник' />
            </div>
            <PropertyViewPanel title='Свойства' useVerticalAlign />
        </div>
    );
}

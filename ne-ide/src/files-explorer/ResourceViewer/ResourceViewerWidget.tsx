import * as React from 'react';
import { ResizablePanel } from '../../core/ui-components';
import { FolderContentViewerWidget } from './FolderContentViewerWidget';
import { ResourceDisplayMode } from './ResourceWidget';
import { ProvidersContext } from '../../contexts/servicesContext';
import { FoldersTreeViewerWidget } from './FoldersTreeViewerWidget';

export const ResourceViewerWidget: React.FC = (): React.ReactElement => {
    const resourceManager = React.useContext(ProvidersContext).resourcesManager;
    const dialogService = React.useContext(ProvidersContext).dialogService;

    return (
        <div className='resource-viewer-widget'>
            <ResizablePanel
                className='resource-viewer-widget__hierarchial-tree-panel'
                resizePosition='right'
                direction='vertical'
                startWidth='20%'
                minWidth='10%'
                maxWidth='35%'
                zIndex='2'>
                <FoldersTreeViewerWidget resourceManager={resourceManager} dialogService={dialogService} />
            </ResizablePanel>
            <FolderContentViewerWidget
                resourceManager={resourceManager}
                displayMode={ResourceDisplayMode.LargeIcons}
            />
        </div>
    );
}

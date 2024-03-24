import * as React from 'react';

import { withCollapseHeader } from '../core/hocs/withCollapsePanel/withCollapseHeader';
import { PanelHeaderCollapse, PanelHeaderExpand } from '../core/icons';
import { PanelHeader, ResizablePanel } from '../core/ui-components';

import './style.scss';
import { ResourceViewerWidget } from './ResourceViewer/ResourceViewerWidget';

const FilesExplorer: React.FC = (): React.ReactElement => {
    return (
        <ResizablePanel
            className='files-explorer'
            direction='horizontal'
            resizePosition='top'
            minHeight='100px'
            maxHeight='600px'
            hideOverflow
            zIndex='3'>
            <ResourceViewerWidget />
        </ResizablePanel>
    );
}

export const FilesExplorerPanel = withCollapseHeader(FilesExplorer, '4px', '0px')

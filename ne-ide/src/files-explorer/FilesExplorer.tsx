import * as React from 'react';

import { withCollapseHeader } from '../core/hocs/withCollapsePanel/withCollapseHeader';
import { ResizablePanel } from '../core/ui-components';

import './style.scss';
import { ResourceViewerWidget } from './ResourceViewer/ResourceViewerWidget';
import { CommandContext } from '../core/providers/commandsProvider/CommandsContexts';

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

export const FilesExplorerPanel = withCollapseHeader(FilesExplorer, '4px', '0px', CommandContext.FILES_EXPLORER_CONTEXT)

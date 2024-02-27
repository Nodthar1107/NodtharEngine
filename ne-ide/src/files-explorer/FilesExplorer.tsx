import * as React from 'react';

import { withCollapseHeader } from '../shared/hocs/withCollapsePanel/withCollapseHeader';
import { PanelHeaderCollapse, PanelHeaderExpand } from '../shared/icons';
import { PanelHeader, ResizablePanel } from '../shared/ui-components';

import './style.css';

const FilesExplorer: React.FC = (): React.ReactElement => {
    return (
        <ResizablePanel
            className='files-explorer'
            direction='horizontal'
            resizePosition='top'
            minHeight='100px'
            maxHeight='600px'>
            <PanelHeader
                title='Проводник'
                expanded={true}
                expandIcon={<PanelHeaderExpand />}
                collapseIcon={<PanelHeaderCollapse />}
            />
        </ResizablePanel>
    );
}

export const FilesExplorerPanel = withCollapseHeader(FilesExplorer, '4px', '0px')

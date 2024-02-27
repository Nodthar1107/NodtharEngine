import * as React from 'react';

import './style.css';
import { ResizablePanel } from '../core/ui-components';
import { withCollapseHeader } from '../core/hocs/withCollapsePanel/withCollapseHeader';

const TreeView: React.FC = (): React.ReactElement => {
    return (
        <ResizablePanel
            className='tree-viewer'
            direction='vertical'
            resizePosition='right'
            minWidth='150px'
            maxWidth='40vw'>
        </ResizablePanel>
    );
}

export const TreeViewPanel = withCollapseHeader(TreeView)

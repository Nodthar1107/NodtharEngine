import * as React from 'react';

import './style.css';
import { ResizablePanel } from '../core/ui-components';
import { withCollapseHeader } from '../core/hocs/withCollapsePanel/withCollapseHeader';

import { TreeViewHierarchy } from './TreeViewHierarchy';

const TreeView: React.FC = (): React.ReactElement => {
    return (
        <ResizablePanel
            className='tree-viewer'
            direction='vertical'
            resizePosition='right'
            minWidth='150px'
            startWidth='250px'
            maxWidth='40vw'
            zIndex='2'> 
            <div style={{ padding: '40px 5px 10px 10px' }}>
                <TreeViewHierarchy />
            </div>
        </ResizablePanel>
    );
}

export const TreeViewPanel = withCollapseHeader(TreeView)

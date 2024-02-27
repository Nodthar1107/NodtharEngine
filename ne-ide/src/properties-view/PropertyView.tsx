import * as React from 'react';

import { withCollapseHeader } from '../core/hocs/withCollapsePanel/withCollapseHeader';
import { PanelHeaderCollapse, PanelHeaderExpand } from '../core/icons';
import { PanelHeader, ResizablePanel } from '../core/ui-components';

import './style.css';

const PropertyView: React.FC = (): React.ReactElement => {
    return (
        <ResizablePanel
            className='property-view'
            direction='vertical'
            resizePosition='left'
            minWidth='150px'
            maxWidth='40vw'>
        </ResizablePanel>
    );
}

export const PropertyViewPanel = withCollapseHeader(PropertyView);

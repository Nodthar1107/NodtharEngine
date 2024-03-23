import * as React from 'react';
import { ResizablePanel } from '../../core/ui-components';
import { ResourceWidget } from './ResourceWidget';
import { ResourceType } from '../ResourcesManager/ResourceType';

export const ResourceViewerWidget: React.FC = (): React.ReactElement => {
    return (
        <div className='resource-viewer-widget'>
            <ResizablePanel
                className='resource-viewer-widget__hierarchial-tree-panel'
                resizePosition='right'
                direction='vertical'
                minWidth='80px'
                maxWidth='35%'
                zIndex='2'>
                <div className='resource-viewer-widget__hierarchial-tree'>

                </div>
            </ResizablePanel>
            <div className='resource-viewer-widget__content-viewer'>
                <ResourceWidget label='aboba.java' mode='bigIcon' resourceType={ResourceType.Foldre} />
            </div>
        </div>
    );
}

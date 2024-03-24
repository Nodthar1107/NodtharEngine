import * as React from 'react';
import { IResourceDescriptor } from '../ResourcesManager/model';
import { ResourceWidget, ResourceDisplayMode } from './ResourceWidget';

interface IFolderViewerWidgetProps {
    parentFolderUri: string | null;
    displayMode: ResourceDisplayMode;
    
    folders?: IResourceDescriptor[];
    resources?: IResourceDescriptor[];
    
    onResourceOpen: (uri: string) => void;
}

export const FolderViewerWidget: React.FC<IFolderViewerWidgetProps> = (
    props: IFolderViewerWidgetProps
) => {
    const getResourcesWidgets = (
        resources: IResourceDescriptor[] | undefined,
    ): React.ReactElement | React.ReactElement[] | undefined => {
        return resources?.map((resource: IResourceDescriptor) => {
            return (
                <ResourceWidget
                    label={resource.label}
                    resourceType={resource.resourceType}
                    mode={props.displayMode}
                    onDoubleClick={() => { props.onResourceOpen(resource.uri) }}
                />
            );
        })
    }

    return (
        <div className='folder-viewer-widget'>
            <div className='folder-viewer-widget__content'>
                {getResourcesWidgets(props.folders)}
                {getResourcesWidgets(props.resources)}
            </div>  
        </div>
    )
}

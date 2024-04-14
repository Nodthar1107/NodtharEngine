import * as React from 'react';
import { IFileSystemNodeDescriptor, IFolderDescriptor, IResourceDescriptor } from '../ResourcesManager/model';
import { ResourceWidget, ResourceDisplayMode } from './ResourceWidget';
import { IResourcesManager } from '../ResourcesManager/IResourcesManager';

interface IFolderViewerWidgetProps {
    resourceManager: IResourcesManager;
    
    displayMode: ResourceDisplayMode;
}

interface IFolderViewerState {
    folders: IFolderDescriptor[];
    resources: IResourceDescriptor[];
}

export class FolderContentViewerWidget extends React.Component<IFolderViewerWidgetProps, IFolderViewerState> {
    constructor(props: IFolderViewerWidgetProps) {
        super(props);

        this.state = {
            ...this.props.resourceManager.getCurrentFolderContent()
        };
    }

    public render(): React.ReactNode {
        return (
            <div className='folder-viewer-widget'>
                <div className='folder-viewer-widget__content'>
                    {this.getResourcesWidgets(this.state.folders)}
                    {this.getResourcesWidgets(this.state.resources)}
                </div>  
            </div>
        );
    }

    private getResourcesWidgets(descriptors: IFileSystemNodeDescriptor[]): React.ReactNode[] {
        return descriptors.map((descriptor: IFileSystemNodeDescriptor) => {
            return (
                <ResourceWidget
                    label={descriptor.label}
                    resourceType={descriptor.resourceType}
                    mode={this.props.displayMode}
                    onDoubleClick={() => { }}
                />
            );
        })
    }
}

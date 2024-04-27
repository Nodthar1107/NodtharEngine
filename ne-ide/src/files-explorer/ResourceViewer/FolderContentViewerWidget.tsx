import * as React from 'react';
import { IFileSystemNodeDescriptor, IFolderDescriptor, IResourceDescriptor } from '../ResourcesManager/model';
import { ResourceWidget, ResourceDisplayMode } from './ResourceWidget';
import { IResourcesManager } from '../ResourcesManager/IResourcesManager';
import { ISubscriberable } from '../events/ISubscriberable';
import { EventType, NotificationEvent } from '../events/NotificationEvent';
import { ResourceType } from '../ResourcesManager/ResourceType';
import { IDialogService } from '../../core/services/DialogService/IDialogService';

interface IFolderViewerWidgetProps {
    resourceManager: IResourcesManager;
    dialogService: IDialogService;
    
    displayMode: ResourceDisplayMode;
}

interface IFolderViewerState {
    folders: IFolderDescriptor[];
    resources: IResourceDescriptor[];
}

export class FolderContentViewerWidget
    extends React.Component<IFolderViewerWidgetProps, IFolderViewerState>
    implements ISubscriberable
{
    constructor(props: IFolderViewerWidgetProps) {
        super(props);

        const content = this.props.resourceManager.getCurrentFolderContent(); 
            if (content) {
                this.state = {
                    ...content
                };
            }
    }

    public componentDidMount(): void {
        this.props.resourceManager.getEventEmmiter().subscribe(this);
    }

    public componentWillUnmount(): void {
        this.props.resourceManager.getEventEmmiter().dispose(this);
    }

    public fireEvent(event: NotificationEvent) {
        if (event.type === EventType.FOLDER_CONTENT_UPDATED) {
            const content = this.props.resourceManager.getCurrentFolderContent(); 
            if (content) {
                this.setState({
                    ...content
                });
            }
        }
    }

    public render(): React.ReactNode {
        return (
            <div
                className='folder-viewer-widget'
                onContextMenu={(event) => {
                    this.openContextMenu(event)
                }}>
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
                    resourceUri={descriptor.uri}
                    resourceType={descriptor.resourceType}
                    mode={this.props.displayMode}
                    onDoubleClick={this.openResource.bind(this, descriptor)}
                />
            );
        })
    }

    private openResource(descriptor: IFileSystemNodeDescriptor) {
        if (descriptor.resourceType === ResourceType.Folder) {
            this.props.resourceManager.changeCurrentDirectory(descriptor.uri);
            
            return;
        }
    }

    private openContextMenu(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const currentFolderUri = this.props.resourceManager.getCurrentFolder()?.uri;

        this.props.dialogService.showContextMenu({
            context: 'files-explorer-folders-content-panel',
            coords: {
                x: event.clientX,
                y: event.clientY
            },
            handlerArgs: currentFolderUri || undefined
        });
    }
}

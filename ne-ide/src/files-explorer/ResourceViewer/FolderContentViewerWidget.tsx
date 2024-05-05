import * as React from 'react';
import { IFileSystemNodeDescriptor, IFolderDescriptor, IResourceDescriptor } from '../ResourcesManager/model';
import { ResourceWidget, ResourceDisplayMode } from './ResourceWidget';
import { IResourcesManager } from '../ResourcesManager/IResourcesManager';
import { ISubscriber } from '../../core/utils/events/ISubscriber';
import { NotificationEvent } from '../../core/utils/events/NotificationEvent';
import { ResourceType } from '../ResourcesManager/ResourceType';
import { IDialogService } from '../../core/services/DialogService/IDialogService';
import { FileSystemEvents } from '../ResourcesManager/events';
import { IEditorsManager } from '../../editor-viewer/EditorManager/IEditorsManager';

interface IFolderViewerWidgetProps {
    resourceManager: IResourcesManager;
    editorsManager: IEditorsManager;
    dialogService: IDialogService;
    
    displayMode: ResourceDisplayMode;
}

interface IFolderViewerState {
    folders: IFolderDescriptor[];
    resources: IResourceDescriptor[];
}

export class FolderContentViewerWidget
    extends React.Component<IFolderViewerWidgetProps, IFolderViewerState>
    implements ISubscriber<FileSystemEvents>
{
    constructor(props: IFolderViewerWidgetProps) {
        super(props);

        const content = this.props.resourceManager.getCurrentFolderContent(); 
        this.state = {
            folders: content?.folders || [],
            resources: content?.resources || []
        };
    }

    public componentDidMount(): void {
        this.props.resourceManager.getEventEmitter().subscribe(this);
    }

    public componentWillUnmount(): void {
        this.props.resourceManager.getEventEmitter().dispose(this);
    }

    public fireEvent(event: NotificationEvent<FileSystemEvents>) {
        if (event.type === FileSystemEvents.FOLDER_CONTENT_UPDATED) {
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
                    resourceUri={descriptor.uri.toString()}
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

        this.props.editorsManager.openEditor(descriptor.uri.toString());
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

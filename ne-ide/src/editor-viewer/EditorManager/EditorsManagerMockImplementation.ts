import { URI } from '../../core/utils/URI';
import { IEditorsManager } from './IEditorsManager';
import { IEditorDescriptor } from '../model';
import { EventEmitter } from '../../core/utils/events/EventEmitter';
import { IEventEmitter } from '../../core/utils/events/IEventEmitter';
import { EditorViewerEvents } from '../events';
import { NotificationEvent } from '../../core/utils/events/NotificationEvent';
import { ISubscriber } from '../../core/utils/events/ISubscriber';
import { FileSystemEvents } from '../../files-explorer/ResourcesManager/events';
import { IFileSystemNodeDescriptor } from '../../files-explorer/ResourcesManager/model';
import { IResourcesManager } from '../../files-explorer/ResourcesManager/IResourcesManager';
import { FILES_EXPLORER_MODULE } from '../../files-explorer/module-types';

import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EditorsManagerMockImplementation implements IEditorsManager, ISubscriber<FileSystemEvents> {
    private openEditors: IEditorDescriptor[] = [];
    private activeEditor: IEditorDescriptor;
    private eventEmitter = new EventEmitter<EditorViewerEvents>();
    
    private resourceManager: IResourcesManager;

    constructor(@inject(FILES_EXPLORER_MODULE.IResourcesManager) resourceManager: IResourcesManager) {
        this.resourceManager = resourceManager;
        
        this.configureEditorDescriptors();
        this.activeEditor = this.openEditors[0];

        this.resourceManager.getEventEmitter().subscribe(this);
    }

    public fireEvent(event: NotificationEvent<FileSystemEvents>) {
        if (event.type === FileSystemEvents.RESOURCES_UPDATED) {
            const changedFiles = event.payload as Map<string, IFileSystemNodeDescriptor>;
            for (const editor of this.openEditors) {
                const editorUri = editor.uri.toString();
                if (changedFiles.has(editorUri)) {
                    const node = changedFiles.get(editorUri) as IFileSystemNodeDescriptor;
                    editor.label = `${node.uri.resourceName}.${node.uri.extension}`;
                    editor.uri = node.uri;
                }
            }

            if (changedFiles.size !== 0) {
                this.eventEmitter.fireEvent(
                    new NotificationEvent<EditorViewerEvents>(EditorViewerEvents.OPEN_EDITORS_LIST_UPDATED)
                );
            }
        }
    }

    public getEventEmitter(): IEventEmitter<EditorViewerEvents> {
        return this.eventEmitter;
    }
    
    public getTabbarsList(): IEditorDescriptor[] {
        return this.openEditors;
    }

    public getActiveTabUri(): URI {
        return this.activeEditor.uri;
    }

    public closeTab(uri: string) {
        const targetUri = URI.createURIFromString(uri);
        const openEditors = this.openEditors.filter((descriptor: IEditorDescriptor) => {
            return !descriptor.uri.equals(targetUri);
        });
        this.openEditors = openEditors;
        this.activeEditor = openEditors[0];

        this.eventEmitter.fireEvent(
            new NotificationEvent<EditorViewerEvents>(EditorViewerEvents.OPEN_EDITORS_LIST_UPDATED)
        );
    }

    public setActiveEditor(uri: string) {
        const targetUri = URI.createURIFromString(uri);
        const editor = this.openEditors.find((descriptor: IEditorDescriptor) => {
            return descriptor.uri.equals(targetUri);
        });

        if (editor) {
            this.activeEditor = editor;
        }
    }

    public openEditor(uri: string) {
        const newEditor = this.createEditorDescriptor(uri)
        this.openEditors.push(newEditor);
        this.activeEditor = newEditor;

        this.eventEmitter.fireEvent(
            new NotificationEvent<EditorViewerEvents>(EditorViewerEvents.OPEN_EDITORS_LIST_UPDATED)
        );
    }

    private configureEditorDescriptors() {
        this.openEditors = [
            {
                label: 'SceneViewer',
                uri: URI.createURIFromString('/MainScene'),
                closable: false
            }
        ];
    }

    private createEditorDescriptor(uri: string): IEditorDescriptor {
        const _uri = URI.createURIFromString(uri);
        return {
            label: `${_uri.resourceName}.${_uri.extension}`,
            uri: _uri,
            closable: true
        };
    } 
}
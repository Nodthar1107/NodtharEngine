import { URI } from '../../core/utils/URI';
import { IEditorsManager } from './IEditorsManager';
import { IEditorDescriptor } from '../model';
import { EventEmitter } from '../../core/utils/events/EventEmitter';
import { IEventEmitter } from '../../core/utils/events/IEventEmitter';
import { EditorViewerEvents } from '../events';
import { NotificationEvent } from '../../core/utils/events/NotificationEvent';
import { injectable } from 'inversify';

import 'reflect-metadata';

@injectable()
export class EditorsManagerMockImplementation implements IEditorsManager {
    private openEditors: IEditorDescriptor[] = [];
    private activeEditor: IEditorDescriptor;
    private eventEmitter = new EventEmitter<EditorViewerEvents>();
    
    constructor() {
        this.configureEditorDescriptors();
        this.activeEditor = this.openEditors[0];
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

    private configureEditorDescriptors() {
        this.openEditors = [
            {
                label: 'SceneViewer',
                uri: URI.createURIFromString('/MainScene'),
                closable: false
            },
            {
                label: 'Aboba',
                uri: URI.createURIFromString('/Aboba.txt'),
                closable: true
            }
        ];
    }
}
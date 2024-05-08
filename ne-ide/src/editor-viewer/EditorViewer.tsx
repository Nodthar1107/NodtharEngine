import * as React from 'react';

import { IEditorsManager } from './managers/IEditorsManager';
import { ISubscriber } from '../core/utils/events/ISubscriber';
import { NotificationEvent } from 'src/core/utils/events/NotificationEvent';
import { EditorViewerEvents } from './events';
import { TabbarPanel } from './TabbarPanel';
import { IEditorDescriptor } from './model';

import './style.scss';
import { EditorRenderer } from './EditorRenderers/EditorRenderer';
import { IEditorRendererProviderService } from './EditorRenderers/EditorRendererProvider';

export interface ITabbarItem {
    label: string;
    uri: string;
    closable: boolean;
}

interface IEditorViewerProps {
    editorManager: IEditorsManager;
    editorRenderer: IEditorRendererProviderService;
}

interface IEditorViewerState {
    tabs: ITabbarItem[];

    activeEditorUri: string;
}

export class EditorViewer extends React.Component<
    IEditorViewerProps,
    IEditorViewerState
> implements ISubscriber<EditorViewerEvents> {
    constructor(props: IEditorViewerProps) {
        super(props);

        this.state = {
            tabs: this.getTabItemsFromDescriptors(this.props.editorManager.getTabbarsList()),
            activeEditorUri: this.props.editorManager.getActiveTabUri().toString()
        };
    }

    public fireEvent(event: NotificationEvent<EditorViewerEvents>) {
        if (event.type === EditorViewerEvents.OPEN_EDITORS_LIST_UPDATED) {
            const uri = this.props.editorManager.getActiveTabUri().toString();
            this.setState({
                tabs: this.getTabItemsFromDescriptors(this.props.editorManager.getTabbarsList()),
                activeEditorUri: uri
            });
        }
    }

    public componentDidMount(): void {
        this.props.editorManager.getEventEmitter().subscribe(this);
    }

    /** @override */
    public render(): React.ReactNode {
        const activeEditorDescriptor = this.props.editorManager.getActiveEditorDescriptor();

        return (
            <div className='editor-viewer'>
                <TabbarPanel
                    editorDescriptors={this.state.tabs}
                    activeTabUri={this.state.activeEditorUri}
                    onTabItemClick={this.onTabItemClick.bind(this)}
                    onTabItemClose={this.onTabItemClose.bind(this)}
                />
                <EditorRenderer
                    editorRendererProvider={this.props.editorRenderer}
                    editorDescriptor={activeEditorDescriptor}
                />
            </div>
        );
    }

    private getTabItemsFromDescriptors(descriptors: IEditorDescriptor[]): ITabbarItem[] {
        return descriptors.map<ITabbarItem>((tab: IEditorDescriptor) => {
            return {
                label: tab.label,
                uri: tab.uri.toString(),
                closable: tab.closable
            }
        });
    }

    private onTabItemClick(index: number) {
        const activeEditorUri = this.state.tabs[index].uri; 
        this.setState({
            activeEditorUri: activeEditorUri
        });

        this.props.editorManager.setActiveEditor(activeEditorUri);
    }

    private onTabItemClose(index: number) {
        this.props.editorManager.closeTab(this.state.tabs[index].uri);
    }
}

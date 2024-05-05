import { URI } from 'src/core/utils/URI';
import { IEventEmitterProvider } from '../../core/utils/events/IEventEmitterProvider';
import { EditorViewerEvents } from '../events';
import { IEditorDescriptor } from '../model';

export interface IEditorsManager extends IEventEmitterProvider<EditorViewerEvents> {
    getTabbarsList: () => IEditorDescriptor[];

    getActiveTabUri: () => URI;

    closeTab: (uri: string) => void;

    setActiveEditor: (uri: string) => void;
}
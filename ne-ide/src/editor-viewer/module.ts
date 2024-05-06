import { Container } from 'inversify';
import { IDIModule } from '../core/dependencies/IDIModule';
import { EDITOR_VIEWER_MODULE } from './module-types';
import { EditorsManagerMockImplementation } from './managers/EditorsManagerMockImplementation';
import { EditorRendererProvider } from './EditorRenderers/EditorRendererProvider';

export class EditorViewerModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind(EDITOR_VIEWER_MODULE.IEditorManager)
            .to(EditorsManagerMockImplementation);

        container
            .bind(EDITOR_VIEWER_MODULE.IEditorRendererProviderService)
            .to(EditorRendererProvider);
    }
}
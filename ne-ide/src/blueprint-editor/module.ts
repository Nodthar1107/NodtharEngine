import { Container } from 'inversify';
import { IDIModule } from '../core/dependencies/IDIModule';
import { EDITOR_VIEWER_MODULE } from '../editor-viewer/module-types';
import { BlueprintEditorProvider } from './BlueprintEditor';
import { BLUEPRINT_EDITOR_MODULE } from './module-types';
import { BlueprintsInfoProviderMockImpl } from './BlueprintsInfoProviderMockImpl';

export class BlueprintModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind(EDITOR_VIEWER_MODULE.IEditorRendererProvider)
            .to(BlueprintEditorProvider);
        container
            .bind(BLUEPRINT_EDITOR_MODULE.IBlueprintsInfoProvider)
            .to(BlueprintsInfoProviderMockImpl)
    }
} 
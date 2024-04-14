import { Container } from 'inversify';
import { IDIModule } from 'src/core/dependencies/IDIModule';
import { FILES_EXPLORER_MODULE } from './module-types';
import { ResourceManagerMockImpl } from './ResourcesManager/ResourceManagerMockImpl';
import { CORE_TYPES } from '../core/module-types';
import { FilesExplorerCommandsContribution } from './FilesExplorerCommandsContribution';

export class FilesExplorerModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind(FILES_EXPLORER_MODULE.IResourcesManager)
            .to(ResourceManagerMockImpl);
        container
            .bind(CORE_TYPES.ICommandContribution)
            .to(FilesExplorerCommandsContribution);
    }
}
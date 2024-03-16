import { Container } from 'inversify';
import { IDIModule } from '../core/dependencies/IDIModule';
import { IIconsProvider } from './providers/IIconsProvider';
import { IconsProvider } from './providers/IconsProvider';
import { CORE_TYPES } from './module-types';
import { ICommandsProvider } from './providers/commandsProvider/ICommandsProvider';
import { CommandsProviderMockImpl } from './providers/commandsProvider/CommandsProviderMockImpl';

export class CoreModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind<IIconsProvider>(CORE_TYPES.IIconsProvider)
            .to(IconsProvider);
        container
            .bind<ICommandsProvider>(CORE_TYPES.ICommandsProvider)
            .to(CommandsProviderMockImpl);
    };
    
}
import { Container } from 'inversify';
import { IDIModule } from '../core/dependencies/IDIModule';
import { IIconsProvider } from './providers/IIconsProvider';
import { IconsProvider } from './providers/IconsProvider';
import { CORE_TYPES } from './module-types';
import { ICommandsProvider } from './providers/commandsProvider/ICommandsProvider';
import { CommandsProviderMockImpl } from './providers/commandsProvider/CommandsProviderMockImpl';
import { ICommandRegister } from './providers/commandsProvider/ICommandRegister';
import { IDialogService } from './services/DialogService/IDialogService';
import { DialogService } from './services/DialogService/DialogService';

export class CoreModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind<IIconsProvider>(CORE_TYPES.IIconsProvider)
            .to(IconsProvider)
            .inSingletonScope();
        container
            .bind<CommandsProviderMockImpl>(CommandsProviderMockImpl)
            .toSelf()
            .inSingletonScope();
        container
            .bind<ICommandsProvider>(CORE_TYPES.ICommandsProvider)
            .to(CommandsProviderMockImpl)
            .inSingletonScope();
        container
            .bind<ICommandRegister>(CORE_TYPES.ICommandRegister)
            .to(CommandsProviderMockImpl)
            .inSingletonScope();
        container
            .bind<IDialogService>(CORE_TYPES.IDialogService)
            .to(DialogService)
            .inSingletonScope();
    };
    
}
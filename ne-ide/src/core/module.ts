import { Container } from 'inversify';
import { IDIModule } from 'src/commons/IDIModule';
import { IIconsProvider } from './providers/IIconsProvider';
import { IconsProvider } from './providers/IconsProvider';
import { CORE_TYPES } from './module-types';

export class CoreModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind<IIconsProvider>(CORE_TYPES.IIconsProvider)
            .to(IconsProvider);
    };
    
}
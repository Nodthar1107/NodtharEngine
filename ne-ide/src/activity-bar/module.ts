import { Container } from 'inversify';
import { IDIModule } from '../commons/IDIModule';
import { ActivityBarItemsProviderMockImpl } from './providers/ActivityBarItemsProviderMockImpl';
import { IActivityBarItemsProvider } from './providers/IActivityBarItemsProvider';
import { IItemComponentsProvider } from './providers/IItemComponentsProvider';
import { ItemsComponentsProvider } from './providers/ItemComponentsProvider';
import { ACTIVITY_BAR_TYPES } from './module-types';

export class ActivityBarModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind<IActivityBarItemsProvider>(ACTIVITY_BAR_TYPES.IActivityBarItemsProvider)
            .to(ActivityBarItemsProviderMockImpl);
        
        container
            .bind<IItemComponentsProvider>(ACTIVITY_BAR_TYPES.IItemComponentsProvider)
            .to(ItemsComponentsProvider);
    };
}
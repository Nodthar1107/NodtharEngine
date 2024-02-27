import * as React from 'react';

import './style.css';
import { activityBarItemsProvider } from './providers/ActivityBarItemsProviderMockImpl';
import { itemsComponentsProvider } from './providers/ItemsComponentsProvider';

export const ActivityBarPanel: React.FC = (): React.ReactElement => {
    const items = React.useMemo<React.ReactElement[]>(() => {
        return itemsComponentsProvider.getItems();
    }, []);
    
    return (
        <div className='activity-bar'>
            {items}
        </div>
    )
}
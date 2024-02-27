import * as React from 'react';

import { DIContext } from '../commons/contexts/DIContext/di-context';
import { IItemComponentsProvider } from './providers/IItemComponentsProvider';
import { ACTIVITY_BAR_TYPES } from './module-types';

import './style.css';

export const ActivityBarPanel: React.FC = (): React.ReactElement => {
    const injector = React.useContext(DIContext).injector;

    const items = React.useMemo<React.ReactElement[]>(() => {
        return injector.get<IItemComponentsProvider>(ACTIVITY_BAR_TYPES.IItemComponentsProvider).getItems();
    }, []);
    
    return (
        <div className='activity-bar'>
            {items}
        </div>
    )
}
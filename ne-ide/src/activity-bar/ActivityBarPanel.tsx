import * as React from 'react';

import { ProvidersContext } from '../contexts/servicesContext';
import { CommandContext } from '../core/providers/commandsProvider/CommandsContexts';
import { ActivityBarCommandsAdapter } from './items/ActivityBarCommandsAdapter';

import './style.css';
import { MainMenuWidget } from './MainMenuWidget/MainMenuWidget';

export const ActivityBarPanel: React.FC = (): React.ReactElement => {
    const commandsProvider = React.useContext(ProvidersContext).commandsProvider;

    const items = React.useMemo<React.ReactElement[]>(() => {
        return new ActivityBarCommandsAdapter().getItems(
            commandsProvider.getCommandsByContext(CommandContext.ACTIVITY_BAR.toString())
        );
    }, []);
    
    return (
        <div className='activity-bar'>
            <MainMenuWidget />
            {items}
        </div>
    );
}
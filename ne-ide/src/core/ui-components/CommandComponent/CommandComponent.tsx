import * as React from 'react';
import { ICommand } from '../../providers/commandsProvider/commands';

import './style.scss';

interface ICommandComponentProps {
    command: ICommand;
}

export const CommandComponent: React.FC<ICommandComponentProps> = (props: ICommandComponentProps) => {
    const enable = props.command.isEnable ? props.command.isEnable() : true; 
    const className = [
        'tabbar-toolbar__command',
        !enable && 'tabbar-toolbar__command_disabled'
    ].filter(Boolean).join(' ');

    const commandHandler = () => {
        if (enable) {
            props.command.execute?.();
        }
    }

    console.log(className);

    return (
        <div className={className} onClick={commandHandler}>
            {React.createElement(props.command.iconComponent as React.FC)}
        </div>
    );
}

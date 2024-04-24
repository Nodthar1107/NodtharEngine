import * as React from 'react';
import { ICommand } from '../../providers/commandsProvider/commands';

import './style.scss';
import { ContextMenuCommand } from './ContextMenuCommand';

export interface IContextMenuPropsProps {
    commands: ICommand[];

    handlerArgs?: any;
    afterCommandHandle?: () => void;
}

export const ContextMenu: React.FC<IContextMenuPropsProps> = (props: IContextMenuPropsProps) => {
    const getCommand = (execute?: (...args: any) => void) => {
        return () => {
            execute?.(props.handlerArgs);
        };
    };
    
    return (
        <div className='context-menu'>
            {props.commands.map((command: ICommand, index: number) => {
                    return (
                        <ContextMenuCommand
                            title={command.title}
                            hotKey={command.hotKey}
                            handler={getCommand(command.execute)}
                            key={index}
                        />
                    );
                })}
        </div>
    );
}

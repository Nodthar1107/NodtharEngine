import * as React from 'react';
import { ICommand } from '../../providers/commandsProvider/commands';

import './style.scss';
import { ContextMenuCommand } from './ContextMenuCommand';
import { withDialogWidget } from './DialogWidget';

export interface IContextMenuPropsProps {
    commands: ICommand[];

    handlerArgs?: any;
    onDialogHide?: () => void;
}

const ContextMenu: React.FC<IContextMenuPropsProps> = (props: IContextMenuPropsProps) => {
    const getCommand = (execute?: (...args: any) => void) => {
        return () => {
            props.onDialogHide?.();
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

export const ContextMenuWidget = withDialogWidget(ContextMenu);

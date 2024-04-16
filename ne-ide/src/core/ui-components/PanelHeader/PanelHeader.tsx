import * as React from 'react';

import { CommandContext } from '../../providers/commandsProvider/CommandsContexts';
import { ProvidersContext } from '../../../contexts/servicesContext';
import { ICommand } from '../../providers/commandsProvider/commands';

import './style.css';
import { CommandComponent } from '../CommandComponent/CommandComponent';

interface IPanelHeaderProps {
    title: string;
    expanded: boolean;

    useVerticalAlign?: boolean;

    expandIcon: React.ReactElement;
    collapseIcon: React.ReactElement;

    commandsContext?: CommandContext;

    style?: React.CSSProperties;
    onExpandChange?: () => void;
}

export const PanelHeader = React.forwardRef(
    (props: IPanelHeaderProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const commandsProvider = React.useContext(ProvidersContext).commandsProvider;
        const contextRef = React.useRef(props.commandsContext);
        
        const className = [
            'panel-header',
            !props.expanded && 'panel-header_collapsed',
            props.useVerticalAlign && 'panel-header_use-vertical-align'
        ]
            .filter(Boolean)
            .join(' ');

        const collapsedIcon = props.expanded ? props.collapseIcon : props.expandIcon;
        
        const toolbarCommands = (): React.ReactElement[] | undefined => {
            if (!contextRef.current) {
                return;
            }

            return commandsProvider.getCommandsByContext(contextRef.current).map((command: ICommand, index: number) => {
                return <CommandComponent command={command} key={index} />;
            })
        }

        React.useEffect(() => {
            contextRef.current = props.commandsContext;
        }, [props.commandsContext])

        return (
            <div className={className} style={props.style} ref={ref}>
                {React.cloneElement(collapsedIcon, {
                    ...collapsedIcon.props,
                    onClick: props.onExpandChange
                })}
                <span className='panel-header__title'>{props.title}</span>
                {props.expanded && (
                    <div className='panel-header__toolbar'>
                        {toolbarCommands()}
                    </ div>
                )}
            </div>
        );
    }
)

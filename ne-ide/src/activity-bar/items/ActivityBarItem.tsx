import * as React from 'react';
import { ICommand } from '../../core/providers/commandsProvider/commands';

import '../styles/activity-bar-item.css';

export interface IActivityBarItemProps {
    command: ICommand;
    active?: boolean;
    disabled?: boolean;
    controlled?: boolean;

    icon?: React.ReactElement;

    onActivate: () => void;
}

export const ActivityBarItem: React.FC<IActivityBarItemProps> = (props: IActivityBarItemProps): React.ReactElement => {
    const [active, setActive] = React.useState(Boolean(props.active));

    const onClickHandler = () => {
        if (!props.controlled) {
            setActive(!active);
        }

        props.onActivate();
    }

    React.useEffect(() => {
        if (props.controlled) {
            setActive(Boolean(props.active));
        }
    }, [props]);

    const icon = props.icon
        ? React.cloneElement(props.icon, {
            ...props.icon.props,
            className: `activity-bar-item__icon ${active && 'activity-bar-item__icon_active'}` 
        }) : (
            <span className='activity-bar-item__icon-replacement-text'>
                {props.command.title.substring(0, 2)}
            </span>
        );
    
    const className = [
        'activity-bar-item',
        active && 'activity-bar-item_active'
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={className} title={props.command.title} onClick={onClickHandler}>
            {icon}
        </div>
    );
}

import * as React from 'react';
import { IActivityBarItemProps } from './ActivityBarItem';

import '../styles/activity-bar-items-group.css';

interface IActivityBarItemsGroupProps {
    children: React.ReactElement[];
}

export const ActivityBarItemsGroup: React.FC<IActivityBarItemsGroupProps> = (
    props: IActivityBarItemsGroupProps
): React.ReactElement => {
    const [activeCommandId, setActiveCommand] = React.useState('null-id');

    return (
        <div className='activity-bar-items-group'>
            {React.Children.map(props.children, (child: React.ReactElement<IActivityBarItemProps>) => React.cloneElement<IActivityBarItemProps>(child, {
                ...child.props,
                active: activeCommandId === child.props.command.id,
                onActivate: () => {
                    child.props.onActivate();
                    setActiveCommand(child.props.command.id);
                },
                controlled: true
            }))}
        </div>
    )
}

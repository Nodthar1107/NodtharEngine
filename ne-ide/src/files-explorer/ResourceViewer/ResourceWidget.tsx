import * as React from 'react';
import { ResourceType } from '../ResourcesManager/ResourceType';
import { ProvidersContext } from '../../contexts/servicesContext';

export enum ResourceDisplayMode {
    LargeIcons = 'large-icons',

    SmallIcons = 'small-icons',

    Datails = 'details'
}

interface IResourceWidgetProps {
    label: string;
    resourceType: ResourceType;

    mode: ResourceDisplayMode;

    onDoubleClick: () => void;
}

export const ResourceWidget: React.FC<IResourceWidgetProps> = (
    props: IResourceWidgetProps
): React.ReactElement => {
    const iconsProvider = React.useContext(ProvidersContext).iconstProvider;

    const resourceIcon = React.useMemo(() => {
        return React.createElement(iconsProvider.getIconById(props.resourceType), {
            className: 'resource-widget__icon'
        });
    }, [props.mode])

    const iconWidget = (className: string): React.ReactElement => {
        return (
            <div
                className={`resource-widget ${className}`}
                title={props.label}
                onDoubleClick={props.onDoubleClick}>
                {resourceIcon}
                <div className='resource-widget__label'>{props.label}</div>
            </div>
        );
    };
    
    if (props.mode === 'large-icons') {
        return iconWidget('resource-widget_big-icon');
    }

    return <></>
}

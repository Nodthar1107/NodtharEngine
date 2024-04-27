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
    resourceUri: string;
    resourceType: ResourceType;

    mode: ResourceDisplayMode;

    onDoubleClick: () => void;
}

export const ResourceWidget: React.FC<IResourceWidgetProps> = (
    props: IResourceWidgetProps
): React.ReactElement => {
    const iconsProvider = React.useContext(ProvidersContext).iconsProvider;
    const dialogService = React.useContext(ProvidersContext).dialogService;
    const commandsService = React.useContext(ProvidersContext).commandsProvider;

    const resourceIcon = React.useMemo(() => {
        return React.createElement(iconsProvider.getIconById(props.resourceType), {
            className: 'resource-widget__icon'
        });
    }, [props.mode])

    const iconWidget = (className: string): React.ReactElement => {
        const onContextMenu = (event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

                dialogService.showContextMenu({
                    context: 'files-explorer-resource-widget-context',
                    coords: {
                        x: event.clientX,
                        y: event.clientY
                    },
                    handlerArgs: props.resourceUri
                });
        }

        return (
            <div
                className={`resource-widget ${className}`}
                title={props.label}
                onDoubleClick={props.onDoubleClick}
                onContextMenu={onContextMenu}>
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

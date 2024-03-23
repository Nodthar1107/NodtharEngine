import * as React from 'react';
import { ResourceType } from '../ResourcesManager/ResourceType';

interface IResourceWidgetProps {
    label: string;
    resourceType: ResourceType;

    mode: 'details' | 'smallIcon' | 'bigIcon'; 
    size?: string;
}

export const ResourceWidget: React.FC<IResourceWidgetProps> = (props: IResourceWidgetProps): React.ReactElement => {
    const iconWidget = (className: string): React.ReactElement => {
        return (
            <div className={`resource-widget ${className}`}>
                <div className='resource-widget__icon'>

                </div>
                <div className='resource-widget__label'>{props.label}</div>
            </div>
        );
    };
    
    if (props.mode === 'bigIcon') {
        return iconWidget('resource-widget_big-icon');
    }

    return <></>
}

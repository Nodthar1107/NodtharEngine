import * as React from 'react';
import { IIconProps } from '../IIconProps';

import './style.css';
import '../commons.css';


export const PanelHeaderExpand: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon panel-header-expand-icon ${props.className}`}>
            <circle cx='7.5' cy='7.5' r='7.5' fill='currentColoMr' />
            <path d='M12 7.5L5.25 11.3971V3.60289L12 7.5Z' fill='#000000' />
        </svg>
    );
} 

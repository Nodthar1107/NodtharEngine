import * as React from 'react';
import { IIconProps } from '../IIconProps';

import './style.css';
import '../commons.css';

export const PanelHeaderCollapse: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon panel-header-collapse-icon ${props.className}`}>
            <circle cx='7.5' cy='7.5' r='7.5' fill='currentColor' />
            <path d='M7.5 12L3.60289 5.25L11.3971 5.25L7.5 12Z' fill='#000000' />
        </svg>
    );
}
import * as React from 'react';
import { IIconProps } from '../IIconProps';

import './style.css';

export const Sphere: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon tree-view-sphere ${props.className || ''}`}>
            <circle cx="8" cy="8" r="8" fill='inherit'/>
        </svg>
    );
} 

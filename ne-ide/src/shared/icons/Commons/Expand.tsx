import * as React from 'react';
import { IIconProps } from '../IIconProps';

import '../commons.css';


export const Expand: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='15'
            height='15'
            viewBox='0 0 15 15'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon ${props.className}`}>
            <rect width='15' height='15' fill='white'/>
            <rect x='6' y='1' width='3' height='13' fill='inherit'/>
            <rect x='1' y='6' width='13' height='3' fill='inherit'/>
        </svg>
    );
} 

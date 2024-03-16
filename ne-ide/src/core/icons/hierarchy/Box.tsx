import * as React from 'react';
import { IIconProps } from '../IIconProps';

export const Box: React.FC<IIconProps> = (props: IIconProps) => {
    return (
        <svg
            width='16'
            height='19'
            viewBox='0 0 16 19'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon ${props.className || ''}`}>
            <path d='M0 4.5L8 9V18.5L0 14V4.5Z' fill='inherit'/>
            <path d='M16 14L9 18.5V9L16 4.5V14Z' fill='inherit'/>
            <path d='M7.53333 0L15 3.5L8.46667 8L1 3.5L7.53333 0Z' fill='inherit'/>
        </svg>
    );
} 

import * as React from 'react';
import { IIconProps } from '../IIconProps';

export const MoveObject: React.FC<IIconProps> = (props: IIconProps) => {
    return (
        <svg
            width='15'
            height='15' 
            viewBox='0 0 15 15'
            fill='inherit'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon ${props.className}`}>
            <rect x='7' y='2' width='1' height='11' fill='inherit'/>
            <rect x='2' y='7' width='11' height='1' fill='inherit'/>
            <path d='M7.5 1L9.66506 4.75H5.33494L7.5 1Z' fill='inherit'/>
            <path d='M14 7.5L10.25 9.66506V5.33494L14 7.5Z' fill='inherit'/>
            <path d='M1 7.5L4.75 5.33494V9.66506L1 7.5Z' fill='inherit'/>
            <path d='M7.5 14L5.33494 10.25H9.66506L7.5 14Z' fill='inherit'/>
        </svg>
    );
}

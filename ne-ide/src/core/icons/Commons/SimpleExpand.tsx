import * as React from 'react';
import { IIconProps } from '../IIconProps';

export const SimpleExpand: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon ${props.className}`}>
            <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M0 0H16V16H0V0ZM15 8L6 14.0622V12.5L12.5 8L6 3.5V1.93782L15 8ZM1 14.1244L10 8.06218L1 2V3.56218L7.5 8.06218L1 12.5622V14.1244Z'
                fill='inherit'
            />
        </svg>
    );
}

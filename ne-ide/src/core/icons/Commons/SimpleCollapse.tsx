import * as React from 'react';
import { IIconProps } from '../IIconProps';

export const SimpleCollapse: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
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
                d='M16 16L0 16L0 0L16 0L16 16ZM1 8L10 1.93782V3.5L3.5 8L10 12.5V14.0622L1 8ZM15 1.87564L6 7.93782L15 14V12.4378L8.5 7.93782L15 3.43782V1.87564Z'
                fill='inherit'
            />
        </svg>

    );
}

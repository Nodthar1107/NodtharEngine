import * as React from 'react';
import { IIconProps } from '../IIconProps';

import '../commons.css';

export const Close: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='inherit'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon ${props.className}`}>
            <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M0 2C0 0.895432 0.895432 0 2 0H14C15.1046 0 16 0.895432 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895432 16 0 15.1046 0 14V2ZM2 2.70711L2.70711 2L7.94975 7.24265L13.1924 2L13.8995 2.70711L8.65685 7.94974L13.9723 13.2652L13.2652 13.9723L7.94975 8.65685L2.67374 13.9329L1.96663 13.2258L7.24264 7.94975L2 2.70711Z'
                fill='inherit'
            />
        </svg>

    );
} 

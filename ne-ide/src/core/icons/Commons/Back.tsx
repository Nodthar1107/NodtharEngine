import * as React from 'react';
import { IIconProps } from '../IIconProps';

import '../commons.css';

export const Back: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
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
                d='M6 1.5L9.89712 6H7.5V11H13.5V13.5H7.5H4.5V6H2.10289L6 1.5Z'
                fill='inherit'
            />
        </svg>
    );
} 

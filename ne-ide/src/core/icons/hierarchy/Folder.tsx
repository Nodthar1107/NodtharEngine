import * as React from 'react';
import { IIconProps } from '../IIconProps';

import './style.css';
import '../commons.css';

export const Folder: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon tree ${props.className || ''}`}>
            <path
                d='M0 4H14C15.1046 4 16 4.89543 16 6V12C16 13.1046 15.1046 14 14 14H2C0.895431 14 0 13.1046 0 12V4Z'
                fill='inherit'
            />
            <path
                d='M0 4C0 2.89543 0.895431 2 2 2H6L7 3L8 4H0V4Z'
                fill='inherit'
            />
        </svg>
    );
}

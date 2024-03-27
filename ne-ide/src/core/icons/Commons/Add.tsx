import * as React from 'react';
import { IIconProps } from '../IIconProps';

import '../commons.css'

export const Add: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
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
                d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58173 12.4183 0 8 0C3.58172 0 0 3.58173 0 8C0 12.4183 3.58172 16 8 16ZM7 7V4H9V7H12V9H9V12H7V9H4V7H7Z'
                fill='inherit' />
        </svg>
    );
}

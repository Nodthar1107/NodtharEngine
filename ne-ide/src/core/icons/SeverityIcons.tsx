import * as React from 'react';
import { IIconProps } from './IIconProps';

import './commons.css';

export const SeverityIcon: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='inherit'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`${props.className}`}>
            <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58173 3.58172 0 8 0C12.4183 0 16 3.58173 16 8ZM9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12ZM8 10C8.55228 10 9 8.433 9 6.5C9 4.567 8.55228 3 8 3C7.44772 3 7 4.567 7 6.5C7 8.433 7.44772 10 8 10Z'
                fill='inherit'
            />
        </svg>

    );
}

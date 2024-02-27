import * as React from 'react';
import { IIconProps } from '../IIconProps';

export const NotFoundIcon: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='13'
            height='15'
            viewBox='0 0 13 15'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon ${props.className}`}>
            <path
                d='M0 1.17719e-06L10 0L11.5 1.5L13 3V8L11.5 7.5L9.75 8L8 7.5L6.5 8L5 7.5L3.25 8L1.5 7.5L0 8V1.17719e-06Z'
                fill='inherit'
            />
            <path
                d='M13 15L0 15V9L1.5 8.5L3.25 9L5 8.5L6.5 9L8 8.5L9.75 9L11.5 8.5L13 9V15Z'
                fill='inherit'
            />
        </svg>
    );
}

import * as React from 'react';
import { IIconProps } from '../IIconProps';

import '../commons.css'

export const PipelineIcon: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
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
                d='M1 15V1H4.67482L14.2998 8L4.67482 15H1Z'
                stroke='inherit'
                fill='inherit'
                stroke-width='2'
            />
        </svg>
    );
}

import * as React from 'react';
import { IIconProps } from '../IIconProps';

import '../commons.css'

export const AccordionExpand: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon ${props.className}`}>
            <path d='M14 8L2 15V1L14 8Z' fill='inherit'/>
        </svg>

    );
}

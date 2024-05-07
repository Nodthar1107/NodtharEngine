import * as React from 'react';
import { IIconProps } from '../IIconProps';

import '../commons.css'

export const AccordionCollapse: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon ${props.className}`}>
            <path d='M8 14L1 2L15 2L8 14Z' fill='inherit'/>
        </svg>
    );
}

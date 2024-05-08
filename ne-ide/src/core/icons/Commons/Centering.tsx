import * as React from 'react';
import { IIconProps } from '../IIconProps';

import '../commons.css'

export const Centering: React.FC<IIconProps> = (props: IIconProps): React.ReactElement => {
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
            className={`ui-component-icon ${props.className}`}>
            <path d='M7.30332 7.3033L3.12074 6.18259L6.1826 3.12072L7.30332 7.3033Z' fill='inherit'/>
            <path d='M8.76779 7.30329L9.88851 3.12071L12.9504 6.18257L8.76779 7.30329Z' fill='inherit'/>
            <path d='M7.30329 8.76777L6.18257 12.9503L3.12071 9.88849L7.30329 8.76777Z' fill='inherit'/>
            <path d='M8.76777 8.76777L12.9503 9.88849L9.88849 12.9504L8.76777 8.76777Z' fill='inherit'/>
            <rect x='2' y='2.70711' width='1' height='4' transform='rotate(-45 2 2.70711)' fill='inherit'/>
            <path d='M13.2929 2L14 2.70711L11.1716 5.53553L10.4645 4.82843L13.2929 2Z' fill='inherit'/>
            <path d='M4.82843 10.5L5.53554 11.2071L2.70711 14.0355L2 13.3284L4.82843 10.5Z' fill='inherit'/>
            <path d='M10.5 11.2071L11.2071 10.5L14.0355 13.3284L13.3284 14.0355L10.5 11.2071Z' fill='inherit'/>
        </svg>

    );
}

import * as React from 'react';

import './style.scss';

export interface IAccrodionSummaryProps {
    children?: React.ReactElement | React.ReactElement[] | string;
    expandIcon?: React.ReactElement;
    className?: string;
    
    onExpandChange?: () => void;
}

export const AccordionSummary: React.FC<IAccrodionSummaryProps> = (
    props: IAccrodionSummaryProps
): React.ReactElement => {
    const accordionSummaryClassName = [
        'accordion-summary',
        props.className
    ].filter(Boolean).join(' ');

    return (
        <div className={accordionSummaryClassName} onClick={props.onExpandChange}>
            <div className='accordion-summary__content'>
                {props.children}
            </div>
            <div className='accordion-summary__expand-icon'>
                {props.expandIcon}
            </div>
        </div>
    );
}

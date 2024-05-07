import * as React from 'react';

import './style.scss';

interface IAccordionDetails {
    children: React.ReactElement | React.ReactElement[] | string;

    className?: string;
}

export const AccordionDetails: React.FC<IAccordionDetails> = (
    props: IAccordionDetails
): React.ReactElement => {
    const className = [
        'accordion-details',
        props.className
    ].filter(Boolean).join(' ');

    return (
        <div className={className}>
            {props.children}
        </div>
    );
}

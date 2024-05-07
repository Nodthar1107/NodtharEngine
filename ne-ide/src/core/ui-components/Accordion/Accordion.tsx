import * as React from 'react';
import { IAccrodionSummaryProps } from './AccordionSummary';
import { AccordionCollapse } from '../../icons/Commons/AccordionCollapse';
import { AccordionExpand } from '../../icons/Commons/AccordionExpand';

import './style.scss';

interface IAccordionProps {
    summary: React.ReactElement;
    details: React.ReactElement;

    expandIcon?: React.ReactElement;
    collapseIcon?: React.ReactElement;

    className?: string;
}

export const Accordion: React.FC<IAccordionProps> = (props: IAccordionProps) => {
    const [expanded, setExpanded] = React.useState(false);
    
    const onExpandChange = () => {
        setExpanded(!expanded);
    }

    const accordionClassName = [
        'accordion',
        props.className && props.className
    ].filter(Boolean).join(' ');

    return (
        <div className={accordionClassName}>
            {React.cloneElement<IAccrodionSummaryProps>(props.summary, {
                ...props.summary.props,
                expandIcon: expanded ? <AccordionCollapse /> : <AccordionExpand />,
                onExpandChange: onExpandChange
            })}
            {expanded && props.details}
        </div>
    );
}



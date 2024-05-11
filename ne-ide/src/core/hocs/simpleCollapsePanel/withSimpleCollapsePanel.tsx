import * as React from 'react';
import { SimpleCollapse } from '../../icons/Commons/SimpleCollapse';
import { SimpleExpand } from '../../icons/Commons/SimpleExpand';

import './style.scss';

interface IAdditionalProperties {
    className?: string
    style?: React.CSSProperties;
}

export function withSimpleCollapsePanel<P>(Component: React.ComponentType<P>) {
    const result = (props: P & JSX.IntrinsicAttributes & IAdditionalProperties) => {
        const [expanded, setExpanded] = React.useState(false);
        let content: React.ReactElement | undefined;

        if (!expanded) {
            content = (
                <div className='simple-collapse__expand-icon' onClick={() => setExpanded(true)}>
                    <SimpleExpand />
                </div>
            );
        } else {
            content = (
                <>
                    <Component {...props} />
                    <div className='simple-collapse__collapse-icon' onClick={() => setExpanded(false)}>
                        <SimpleCollapse />
                    </div>
                </>
            )
        }

        return (
            <div className={`simple-collapse-panel ${props.className}`} style={props.style}>
                {content}
            </div>
        );
    }

    return result;
}

import * as React from 'react';

import './style.css';

interface IPanelHeaderProps {
    title: string;
    expanded: boolean;

    useVerticalAlign?: boolean;

    expandIcon: React.ReactElement;
    collapseIcon: React.ReactElement;

    onExpandChange?: () => void;
    style?: React.CSSProperties;
}

export const PanelHeader = React.forwardRef(
    (props: IPanelHeaderProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const className = [
            'panel-header',
            !props.expanded && 'panel-header_collapsed',
            props.useVerticalAlign && 'panel-header_use-vertical-align'
        ]
            .filter(Boolean)
            .join(' ');

        const collapsedIcon = props.expanded ? props.collapseIcon : props.expandIcon;
        
        return (
            <div className={className} style={props.style} ref={ref}>
                {React.cloneElement(collapsedIcon, {
                    ...collapsedIcon.props,
                    onClick: props.onExpandChange
                })}
                <span className='panel-header__title'>{props.title}</span>
            </div>
        );
    }
)

import * as React from 'react';
import { PanelHeaderCollapse, PanelHeaderExpand } from '../../icons';
import { PanelHeader } from '../../ui-components';

import './style.css';

interface IAdditionalProps {
    title: string;
    useVerticalAlign?: boolean;
}

interface IBaseProps {
    children: React.ReactElement | React.ReactElement[];
}

export function withCollapseHeader<IBaseProps extends IAdditionalProps>(
    Component: React.ComponentType<IBaseProps>,
    headerTop: string = '0',
    headerBottom: string = '0'
) {
    const containerElement = (props: IBaseProps): React.ReactElement => {
        const [expanded, setExpanded] = React.useState(true);
        
        const renderPanelHeader = (
            <PanelHeader
                title={props.title}
                expanded={expanded}
                useVerticalAlign={props.useVerticalAlign}
                collapseIcon={<PanelHeaderCollapse />}
                expandIcon={<PanelHeaderExpand />}
                onExpandChange={() => setExpanded(!expanded)}
                style={{
                    position: 'absolute',
                    width: '100%',
                    top: headerTop,
                    left: headerBottom,
                    zIndex: 10
                }}
            />
        )

        if (!expanded) {
            const className = [
                'collapsed-panel',
                props.useVerticalAlign && 'collapsed-panel_use-vertical-align'
            ].filter(Boolean).join(' ');

            return (
                <div className={className}>
                    {renderPanelHeader}
                </div>
            );
        }

        return (
            <div className='named-panel'>
                {renderPanelHeader}
                <Component {...props} />
            </div>
        );
    }

    return containerElement;
}

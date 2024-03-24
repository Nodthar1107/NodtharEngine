import * as React from 'react';

import './style.css';
import { IIconProps } from 'src/core/icons/IIconProps';

export interface ITreeViewItemProps {
    label: string;
    nodeId: string;

    root?: boolean;
    expanded?: Set<string>;
    selected?: string;
    startIcon?: React.ReactElement;

    collapseIcon?: React.ReactElement;
    expandIcon?: React.ReactElement;

    children?: React.ReactElement | React.ReactElement[] | undefined;

    expandIfChildSelected?: boolean;
    paddingLeft?: number;

    onItemSelect?: (nodeId: string) => void;
    onExpandChange?: (nodeId: string) => void;
}

export const TreeViewItem: React.FC<ITreeViewItemProps> = (props: ITreeViewItemProps): React.ReactElement => {
    const headerClassName = [
        'ui-component-tree-view-item__header',
        props.selected === props.nodeId ? 'ui-component-tree-view-item__header_selected' : ''
    ]
        .filter(Boolean)
        .join(' ');

    const expanded = props.expanded?.has(props.nodeId) as boolean;

    return (
        <div className='ui-component-tree-view-item'>
            <div
                className={headerClassName}
                style={{ paddingLeft: `${props.paddingLeft as number + 5}px` }}>
                {getExpandIcon(props, expanded)}
                <div className='ui-component-tree-view-item__named-header' onClick={() => props.onItemSelect?.(props.nodeId)}>
                    {props.startIcon && React.cloneElement(props.startIcon, {
                        ...props.startIcon.props,
                        className: 'ui-component-tree-view-item__start-icon'
                    })}
                    <span className='ui-component-tree-view-item__label'>{props.label}</span>
                </div>
            </div>
            {(props.root || expanded) && props.children && (
                <div className='ui-component-tree-view-item__children'>
                    {React.Children.map(
                        props.children, 
                        (child: React.ReactElement<ITreeViewItemProps>) => React.cloneElement(child, {
                            ...child.props,
                            expanded: props.expanded,
                            selected: props.selected,
                            collapseIcon: props.collapseIcon,
                            expandIcon: props.expandIcon,
                            paddingLeft: props.paddingLeft as number + 16,
                            onExpandChange: props.onExpandChange,
                            onItemSelect: props.onItemSelect
                    }))}
                </div>
            )}
        </div>
    );
}

const getExpandIcon = (props: ITreeViewItemProps, expanded: boolean): React.ReactElement => {
    if (props.root) {
        return <></>;
    }
    
    if (!props.children) {
        return <span className='empty-icon' style={{ width: '16px' }} />;
    }

    const expandIcon = (expanded ? props.collapseIcon : props.expandIcon) as React.ReactElement<IIconProps>;

    return React.cloneElement(expandIcon, {
        ...expandIcon.props,
        onClick: () => props.onExpandChange?.(props.nodeId as string)
    });
}

import * as React from 'react';

import './style.css';

export interface ITreeViewItemProps {
    label: string;
    nodeId: string;

    expanded?: Set<string>;
    selected?: string;
    startIcon?: React.ReactElement;

    collapseIcon?: React.ReactElement;
    expandIcon?: React.ReactElement;

    children?: React.ReactElement | React.ReactElement[];

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

    const expanded = true;

    return (
        <div className='ui-component-tree-view-item'>
            <div className={headerClassName} onClick={() => props.onItemSelect?.(props.nodeId)}>
                {expanded ? props.collapseIcon : props.expandIcon}
                {props.startIcon && React.cloneElement(props.startIcon, {
                    ...props.startIcon.props,
                    className: 'ui-component-tree-view-item__start-icon'
                })}
                <span className='ui-component-tree-view-item__label'>{props.label}</span>
            </div>
            {expanded && props.children && (
                <div className='ui-component-tree-view-item__children'>
                    {React.Children.map(
                        props.children, 
                        (child: React.ReactElement<ITreeViewItemProps>) => React.cloneElement(child, {
                            ...child.props,
                            expanded: props.expanded,
                            selected: props.selected,
                            collapseIcon: props.collapseIcon,
                            expandIcon: props.expandIcon
                    }))}
                </div>
            )}
        </div>
    );
}

import * as React from 'react';

export const NE_TREE_VIEW__NODE_ROW = 'tree-view__node-row';
export const NE_TREE_VIEW__NODE_ROW_SELECTED = 'tree-view__node-row_selected';
export const NE_TREE_VIEW__NODE_INDENT = 'tree-view__node-row-indent';
export const NE_TREE_VIEW__NODE_CONTENT = 'tree-view__node-content';
export const NE_TREE_VIEW_NODE__EXPAND_ICON = 'tree-view__node-expand-icon'
export const NE_TREE_VIEW__NODE_ICON = 'tree-view__node-icon';
export const NE_TREE_VIEW__NODE_LABEL = 'tree-view__node-label';

export interface ITreeNode {
    label: string;

    epxanded: boolean;

    uri: string;

    icon?: React.ReactElement;
}

export interface ITreeNodeRow {
    node: ITreeNode;

    indent: number;

    index: number;

    hasChildren: boolean;

    selected: boolean;
}
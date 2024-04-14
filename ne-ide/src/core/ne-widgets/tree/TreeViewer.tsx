import * as React from 'react';
import {
    ITreeNode,
    ITreeNodeRow,
    NE_TREE_VIEW__NODE_CONTENT,
    NE_TREE_VIEW__NODE_ICON,
    NE_TREE_VIEW__NODE_LABEL,
    NE_TREE_VIEW__NODE_ROW,
    NE_TREE_VIEW__NODE_ROW_SELECTED,
    NE_TREE_VIEW_NODE__EXPAND_ICON
} from './model';


export interface ITreeViewProps {
    rows: ITreeNodeRow[];
    renderNode?: (node: ITreeNode, index: number) => React.ReactNode;
    renderExpand?: (node: ITreeNode, hasChildren: boolean, index: number) => React.ReactNode;
    renderTreeIndent?: (indent: number) => React.ReactNode;

    onNodeSelect?: (index: number) => void;
}

export const TreeView: React.FC<ITreeViewProps> = (props: ITreeViewProps): React.ReactElement => {
    const _renderTreeIndent = props.renderTreeIndent || renderTreeIndent;
    const _renderExpand = props.renderExpand || renderExpand;
    const _renderNode = props.renderNode || renderNode;
    
    return (
        <div className='tree-view'>
            {filterNodes(props.rows).map((row: ITreeNodeRow, index: number) => {
                const className = [
                    NE_TREE_VIEW__NODE_ROW,
                    row.selected && NE_TREE_VIEW__NODE_ROW_SELECTED
                ].filter(Boolean).join(' ');

                return (
                    <div className={className} key={index} onClick={() => { props.onNodeSelect?.(row.index) }}>
                        {_renderTreeIndent(row.indent)}
                        {_renderExpand(row.node, row.hasChildren, row.index)}
                        {_renderNode(row.node, index)}
                    </div>
                );
            })}
        </div>
    );
}

function filterNodes(rows: ITreeNodeRow[]): ITreeNodeRow[] {
    if (rows === undefined) {
        return [];
    }

    const result: ITreeNodeRow[] = [];
    const parentRowIdent = Array.from([-1]);
    const parentRowExpanded = [true];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        while (rows[rowIndex].indent <= parentRowIdent[parentRowIdent.length - 1]) {
            parentRowIdent.pop();
            parentRowExpanded.pop();
        }

        if (parentRowExpanded[parentRowExpanded.length - 1]) {
            result.push(rows[rowIndex]);
        }

        if (rows[rowIndex].indent > parentRowIdent[parentRowIdent.length - 1]) {
            parentRowIdent.push(rows[rowIndex].indent);
            parentRowExpanded.push(rows[rowIndex].node.epxanded);
        }
    }

    return result;
}

function renderTreeIndent(indent: number): React.ReactNode {
    return (
        <div
            className={NE_TREE_VIEW__NODE_ROW}
            style={{ paddingLeft: `${10 * indent}px` }}
        />
    );
}

function renderNode(node: ITreeNode, index: number): React.ReactNode {
    return (
        <div className={NE_TREE_VIEW__NODE_CONTENT}>
            <div className={NE_TREE_VIEW_NODE__EXPAND_ICON}>
            </div>
            <div className={NE_TREE_VIEW__NODE_ICON}>
            </div>
            <div className={NE_TREE_VIEW__NODE_LABEL}>
                {node.label}
            </div>
        </div>
    );
}

function renderExpand(node: ITreeNode, hasChildren: boolean, index: number): React.ReactNode {
    return (
        <div className={NE_TREE_VIEW_NODE__EXPAND_ICON}>
        </div>
    );
}

import * as React from 'react';
import { TreeView } from './TreeViewer';
import {
    ITreeNode,
    ITreeNodeRow,
    NE_TREE_VIEW__NODE_CONTENT,
    NE_TREE_VIEW__NODE_ICON,
    NE_TREE_VIEW__NODE_INDENT,
    NE_TREE_VIEW__NODE_LABEL,
    NE_TREE_VIEW_NODE__EXPAND_ICON
} from './model';
import { Collapse, Expand } from '../../icons';
import { IIconProps } from '../../icons/IIconProps';

import './style.scss';

export interface ITreeWidgetProps {

}

export interface ITreeWidgetState {
    nodeRows: ITreeNodeRow[];
    selectedRowIndex: number | null;
}

export class TreeWidget<P extends ITreeWidgetProps> extends React.Component<P, ITreeWidgetState> {
    constructor(props: P) {
        super(props);

        this.state = {
            nodeRows: [],
            selectedRowIndex: null
        };
    }

    public render(): React.ReactNode {
        return this.renderTree();
    }

    protected renderTree(): React.ReactNode {
        return (
            <TreeView
                rows={this.state.nodeRows}
                renderTreeIndent={this.renderTreeIndent.bind(this)}
                renderNode={this.renderTreeNode.bind(this)}
                renderExpand={this.renderExpand.bind(this)}
                onNodeSelect={this.onNodeRowSelect.bind(this)}
                onContextMenu={this.onNodeRowRightButtonClick.bind(this)}
            />
        )
    }

    protected renderTreeIndent(indent: number): React.ReactNode {
        return (
            <div
                className={NE_TREE_VIEW__NODE_INDENT}
                style={{ paddingLeft: `${25 * indent}px` }}
            />
        );
    }

    protected renderExpand(node: ITreeNode, hasChildren: boolean, index: number) {
        const expandedIcon = node.epxanded ? <Collapse /> : <Expand />;

        return (
            <div className={NE_TREE_VIEW_NODE__EXPAND_ICON}>
                {hasChildren && React.cloneElement<IIconProps>(expandedIcon, {
                    ...expandedIcon.props,
                    onClick: (event: React.MouseEvent) => {
                        event.stopPropagation();
                        this.changeNodeRowExpand(index)
                    }
                })}
            </div>
        );
    }

    protected renderTreeNode(node: ITreeNode,): React.ReactNode {
        return (
            <div className={NE_TREE_VIEW__NODE_CONTENT}>
                <div className={NE_TREE_VIEW__NODE_ICON}>
                    {node.icon}
                </div>
                <div className={NE_TREE_VIEW__NODE_LABEL}>
                    {node.label}
                </div>
            </div>
        );
    }

    protected changeNodeRowExpand(index: number) {
        const updatedList = this.state.nodeRows.slice();
        const targetRow = updatedList[index];
        const updatedExpandValue = !targetRow.node.epxanded
        updatedList[index] = this.updateNodeRowState(targetRow, { epxanded: updatedExpandValue });

        let currentNodeRowIndex = index + 1;
        if (currentNodeRowIndex < updatedList.length - 1) {
            let currentNodeRow = updatedList[currentNodeRowIndex]; 
            while (currentNodeRowIndex < updatedList.length && targetRow.indent < currentNodeRow.indent) {
                updatedList[currentNodeRowIndex] = this.updateNodeRowState(currentNodeRow, { epxanded: updatedExpandValue });
                ++currentNodeRowIndex;
                currentNodeRow = updatedList[currentNodeRowIndex];
            }
        }

        this.setState({
            nodeRows: updatedList
        });
    }

    protected onNodeRowSelect(index: number) {
        const updatedRows = this.state.nodeRows.slice();
        updatedRows[index] = {
            ...updatedRows[index],
            selected: true
        };

        const previousSelected = this.state.selectedRowIndex;
        if (previousSelected !== null && previousSelected !== index) {
            updatedRows[previousSelected] = {
                ...updatedRows[previousSelected],
                selected: false
            }
        }

        this.setState({
            nodeRows: updatedRows,
            selectedRowIndex: index
        });
    }

    protected onNodeRowRightButtonClick(node: ITreeNode, event: React.MouseEvent) {
        event.preventDefault();
    }

    private updateNodeRowState(row: ITreeNodeRow, updatedFiels: Partial<ITreeNode>): ITreeNodeRow {
        return {
            ...row,
            node: {
                ...row.node,
                ...updatedFiels
            }
        }
    }
}
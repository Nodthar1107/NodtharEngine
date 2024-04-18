import { ReactNode } from 'react';
import { ITreeWidgetProps, TreeWidget } from '../../core/ne-widgets/tree/TreeWidget';
import { IResourcesManager } from '../ResourcesManager/IResourcesManager';
import { ITreeNode, ITreeNodeRow } from 'src/core/ne-widgets/tree/model';
import { IFileSystemNodeDescriptor, IFolderDescriptor } from '../ResourcesManager/model';
import { Folder } from '../../core/icons/hierarchy/Folder';
import { ISubscriberable } from '../events/ISubscriberable';
import { EventType, NotificationEvent } from '../events/NotificationEvent';
import { IDialogService } from '../../core/services/DialogService/IDialogService';

interface IFoldersTreeViewerWidgetProps extends ITreeWidgetProps {
    resourceManager: IResourcesManager;
    dialogService: IDialogService
}

export class FoldersTreeViewerWidget extends TreeWidget<IFoldersTreeViewerWidgetProps> implements ISubscriberable {
    constructor(props: IFoldersTreeViewerWidgetProps) {
        super(props);

        this.state = {
            nodeRows: this.transformModelToNodeRows(),
            selectedRowIndex: null
        };
    }

    public componentDidMount(): void {
        this.props.resourceManager.getEventEmmiter().subscribe(this);
    }

    public componentWillUnmount(): void {
        this.props.resourceManager.getEventEmmiter().dispose(this);
    }

    public render(): ReactNode {
        return super.render();
    }

    public fireEvent(event: NotificationEvent) {
        if (event.type === EventType.TREE_VIEW_UPDATED) {
            const targetFolder = this.props.resourceManager.getCurrentFolder();
            const parentsRowsUris: string[] = [];
            let parent = !!targetFolder ? targetFolder.parent as IFolderDescriptor : null;  
            while (parent) {
                parentsRowsUris.push(parent.uri);
                parent = parent.parent as IFolderDescriptor;
            }

            const updatedRows = this.transformModelToNodeRows();
            const oldIndexedRows = this.state.nodeRows.reduce(
                (map: Map<string, ITreeNodeRow>, row: ITreeNodeRow) => {
                    map.set(row.node.uri, row);
                    
                    return map;
                },
                new Map()
            );

            let selectedRowIndex: number | null = null;
            updatedRows.forEach((row: ITreeNodeRow, index: number) => {
                const oldRow = oldIndexedRows.get(row.node.uri);
                if (oldRow) {
                    row.node.epxanded = parentsRowsUris.indexOf(row.node.uri) !== -1 ? true : oldRow.node.epxanded; 
                }

                if (row.node.uri === targetFolder?.uri) {
                    row.selected = true;
                    selectedRowIndex = index;
                }
            });

            this.setState({
                nodeRows: updatedRows,
                selectedRowIndex: selectedRowIndex
            });
        }
    }

    protected onNodeRowSelect(index: number): void {
        super.onNodeRowSelect(index);

        this.props.resourceManager.changeCurrentDirectory(this.state.nodeRows[index].node.uri);
    }

    protected onNodeRowRightButtonClick(node: ITreeNode, event: React.MouseEvent): void {
        super.onNodeRowRightButtonClick(node, event);

        this.props.dialogService.showContextMenu({
            context: 'tree-view-context',
            coords: {
                x: event.clientX,
                y: event.clientY
            },
            handlerArgs: node.uri
        });
    }

    private transformModelToNodeRows(): ITreeNodeRow[] {
        const root = this.props.resourceManager.getRootFolder();

        if (root === undefined) {
            return [];
        }

        return this.toNodeRows(root.folders, 1, [this.toNodeRow(root, 0, 0, root.folders.length > 0, true)]);
    }

    private toNodeRows(descriptors: IFolderDescriptor[], indent: number, rows: ITreeNodeRow[]): ITreeNodeRow[] {
        descriptors.forEach((descriptor: IFolderDescriptor) => {
            rows.push(this.toNodeRow(descriptor, indent, rows[rows.length - 1].index + 1, descriptor.folders.length > 0));
            this.toNodeRows(descriptor.folders, indent + 1, rows);
        });

        return rows;
    }

    private toNodeRow(descriptor: IFileSystemNodeDescriptor, indent: number, index: number, hasChildren: boolean, expanded = false): ITreeNodeRow {
        return {
            node: {
                label: descriptor.label,
                epxanded: expanded,
                uri: descriptor.uri,
                icon: <Folder />
            },
            indent: indent,
            index: index,
            hasChildren: hasChildren,
            selected: false
        };
    }
}
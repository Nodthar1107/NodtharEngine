import { ReactNode } from 'react';
import { ITreeWidgetProps, TreeWidget } from '../../core/ne-widgets/tree/TreeWidget';
import { IResourcesManager } from '../ResourcesManager/IResourcesManager';
import { ITreeNodeRow } from 'src/core/ne-widgets/tree/model';
import { IFileSystemNodeDescriptor, IFolderDescriptor } from '../ResourcesManager/model';
import { Folder } from '../../core/icons/hierarchy/Folder';

interface IFoldersTreeViewerWidgetProps extends ITreeWidgetProps {
    resourceManager: IResourcesManager;
}

export class FoldersTreeViewerWidget extends TreeWidget<IFoldersTreeViewerWidgetProps> {
    constructor(props: IFoldersTreeViewerWidgetProps) {
        super(props);

        this.state = {
            nodeRows: this.transformModelToNodeRows(),
            selectedRowIndex: null
        };
    }

    public render(): ReactNode {
        return super.render();
    }

    private transformModelToNodeRows(): ITreeNodeRow[] {
        const root = this.props.resourceManager.getRootFolder();

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
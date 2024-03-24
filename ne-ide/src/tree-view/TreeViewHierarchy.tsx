import * as React from 'react';
import { TreeView, TreeViewItem } from '../core/ui-components';
import { ProvidersContext } from '../contexts/servicesContext';
import { IHierarchyItem } from './items/IHierarchyItem';
import { Collapse, Expand } from '../core/icons';

export const TreeViewHierarchy: React.FC = (): React.ReactElement => {
    const treeViewProvider = React.useContext(ProvidersContext).treeViewManager;

    const treeViewItems = React.useMemo(() => {
        return getTreeViewItem(treeViewProvider.getSceneHierarchy(''));
    }, []);
    
    return (
        <TreeView
            rootElementId={'scene'}
            collapseIcon={<Collapse />}
            expandIcon={<Expand />}>
            {treeViewItems}
        </TreeView>
    );
}

const getTreeViewItemsChildren = (
    children: IHierarchyItem | IHierarchyItem[] | undefined
): React.ReactElement | React.ReactElement[] | undefined => {
    if (children === undefined) {
        return undefined;
    }

    if (Array.isArray(children)) {
        return (children as IHierarchyItem[]).map((item: IHierarchyItem) => {
            return getTreeViewItem(item);
        });
    } 

    return getTreeViewItem(children as IHierarchyItem);
}

const getTreeViewItem = (item: IHierarchyItem): React.ReactElement => {
    return (
        <TreeViewItem
            label={item.label}
            nodeId={item.uri}
            startIcon={item.icon && React.createElement(item.icon)}>
            {getTreeViewItemsChildren(item.children)}
        </TreeViewItem>
    );
}

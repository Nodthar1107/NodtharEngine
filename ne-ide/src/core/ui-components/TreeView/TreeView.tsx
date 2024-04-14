import * as React from 'react';
import { Collapse, Expand } from '../../icons';
import { ITreeViewItemProps } from '../TreeItem/TreeViewItem';

interface ITreeViewProps {
    children?: React.ReactElement<ITreeViewItemProps>[] | React.ReactElement<ITreeViewItemProps> | null;

    rootElementId?: string;
    selected?: string;
    expanded?: string[];

    expandIfChildSelected?: boolean;

    collapseIcon?: React.ReactElement;
    expandIcon?: React.ReactElement;

    onItemSelectChange?: (nodeId: string) => void;
    onItemExpandChange?: (nodeId: string) => void;
}


export const TreeView: React.FC<ITreeViewProps> = (props: ITreeViewProps): React.ReactElement => {
    const [selected, setSelected] = React.useState(props.selected || '');
    const [expandedNodes, setExpandedNodes] = React.useState(new Set<string>(props.expanded));

    const onNodeExpandedChange = (nodeId: string) => {
        if (props.onItemExpandChange) {
            props.onItemExpandChange(nodeId);

            return;
        }

        const updatedNodeSet = new Set(expandedNodes.values());
        updatedNodeSet.has(nodeId) ? updatedNodeSet.delete(nodeId) : updatedNodeSet.add(nodeId);

        setExpandedNodes(updatedNodeSet);
    };

    const onItemSelectChange = (nodeId: string) => {
        if (props.onItemSelectChange) {
            props.onItemSelectChange(nodeId);

            return;
        }

        setSelected(nodeId);
    };

    React.useEffect(() => {
        setSelected(props.selected as string)
    }, [props.selected]);

    React.useEffect(() => {
        setExpandedNodes(new Set<string>(props.expanded));
    }, [props.expanded]);

    return (
        <div className='ui-component-tree-view'>
            {props.children && React.Children.map(props.children, (child: React.ReactElement<ITreeViewItemProps>) => React.cloneElement(child, {
                ...child.props,
                root: props.rootElementId === child.props.nodeId,
                startIcon: child.props.startIcon,
                selected: selected,
                expanded: expandedNodes,
                collapseIcon: props.collapseIcon || <Collapse />,
                expandIcon: props.expandIcon || <Expand />,
                paddingLeft: 0,
                onItemSelect: props.onItemSelectChange || onItemSelectChange,
                onExpandChange: props.onItemExpandChange || onNodeExpandedChange
            }))}
        </div>
    );
}

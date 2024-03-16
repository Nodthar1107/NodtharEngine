import * as React from 'react';
import { Collapse, Expand } from '../../icons';
import { ITreeViewItemProps } from '../TreeItem/TreeViewItem';


interface ITreeViewProps {
    children: React.ReactElement<ITreeViewItemProps>[] | React.ReactElement<ITreeViewItemProps>;
    
    selected?: string;
    expanded?: string[];
    
    collapseIcon?: React.ReactElement;
    expandIcon?: React.ReactElement;
    
    onItemSelectChange: (nodeId: string) => void;
    onItemExpandChange: (nodeId: string) => void;
}


export const TreeView: React.FC<ITreeViewProps> = (props: ITreeViewProps): React.ReactElement => {
    const [selected, setSelected] = React.useState(props.selected || '');
    const [expandedNodes, setExpandedNodes] = React.useState(props.expanded || new Set()); 
    
    return (
        <div className='ui-component-tree-view'>
            {React.Children.map(props.children, (child: React.ReactElement<ITreeViewItemProps>) => React.cloneElement(child, {
                ...child.props,
                startIcon: child.props.startIcon,
                selected: selected,
                collapseIcon: props.collapseIcon || <Collapse />,
                expandIcon: props.expandIcon || <Expand />,
                onItemSelect: props.onItemSelectChange,
                onExpandChange: props.onItemExpandChange
            }))}
        </div>
    );
}

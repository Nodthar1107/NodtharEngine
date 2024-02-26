import * as React from 'react';
import { Collapse, Expand } from '../../icons';


interface ITreeViewProps {
    selected: string;
    expanded: string[];

    children: React.ReactElement[] | React.ReactElement;

    collapseIcon?: React.ReactElement;
    expandIcon?: React.ReactElement;
    
    onItemSelectChange: (nodeId: string) => void;
    onItemExpandChange: (nodeId: string) => void;
}


export const TreeView: React.FC<ITreeViewProps> = (props: ITreeViewProps): React.ReactElement => {
    return (
        <div className='ui-component-tree-view'>
            {React.Children.map(props.children, (child: React.ReactElement) => React.cloneElement(child, {
                ...child.props,
                slected: props.selected,
                expanded: props.expanded,
                collapseIcon: props.collapseIcon || <Collapse />,
                expandIcon: props.expandIcon || <Expand />,
                onItemSelect: props.onItemSelectChange,
                onExpandChange: props.onItemExpandChange
            }))}
        </div>
    );
}

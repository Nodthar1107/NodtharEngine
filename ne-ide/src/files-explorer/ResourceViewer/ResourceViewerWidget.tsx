import * as React from 'react';
import { ResizablePanel, TreeView, TreeViewItem } from '../../core/ui-components';
import { FolderViewerWidget } from './FolderViewerWidget';
import { ProvidersContext } from '../../contexts/servicesContext';
import { IFolderDescriptor } from '../ResourcesManager/model';
import { Folder } from '../../core/icons/hierarchy/Folder';
import { ResourceDisplayMode } from './ResourceWidget';
import { ResourceType } from '../ResourcesManager/ResourceType';

export const ResourceViewerWidget: React.FC = (): React.ReactElement => {
    const resourcesManager = React.useContext(ProvidersContext).resourcesManager;
    const model = React.useMemo(() => {
        return resourcesManager.getRootFolder();
    }, []);

    const [currentFolderUri, setCurrentFolderUri] = React.useState(model.label);
    const currentFolder = resourcesManager.getFolderByRelativePath(currentFolderUri);
    const [expandedNodes, setExpandedNodes] = React.useState([model.label]);

    const onItemSelectChange = (nodeId: string) => {
        setCurrentFolderUri(nodeId);
    }

    const onResourceOpen = (nodeId: string) => {
        const fileSystemNode = resourcesManager.getFileSystemNodeDescriptorByRelativePath(nodeId);

        if (fileSystemNode?.resourceType === ResourceType.Folder) {
            onItemSelectChange(nodeId);

            const expandedSet = new Set<string>(expandedNodes);
            
            let parentFolder: IFolderDescriptor | null = (fileSystemNode as IFolderDescriptor).parent;
            while (parentFolder !== null) {
                expandedSet.add(parentFolder.uri);
                parentFolder = parentFolder.parent;
            }

            setExpandedNodes(Array.from(expandedSet.values()));

            return;
        }
    }

    return (
        <div className='resource-viewer-widget'>
            <ResizablePanel
                className='resource-viewer-widget__hierarchial-tree-panel'
                resizePosition='right'
                direction='vertical'
                startWidth='20%'
                minWidth='10%'
                maxWidth='35%'
                zIndex='2'>
                <div className='resource-viewer-widget__hierarchial-tree'>
                    <TreeView
                        rootElementId={model.uri}
                        selected={currentFolderUri}
                        expanded={expandedNodes}
                        onItemSelectChange={onItemSelectChange}>
                        {getFoldersTree(model)}
                    </TreeView>
                </div>
            </ResizablePanel>
            <FolderViewerWidget
                folders={currentFolder?.folders}
                resources={currentFolder?.resources}
                parentFolderUri={null}
                displayMode={ResourceDisplayMode.LargeIcons}
                onResourceOpen={onResourceOpen}
            />
        </div>
    );
}

const getFoldersTree = (folder: IFolderDescriptor): React.ReactElement => {
    return (getInnerFolders([folder]) as React.ReactElement[])[0];
}

const getInnerFolders = (children: IFolderDescriptor[]): React.ReactElement[] | undefined => {
    if (children.length === 0) {
        return undefined;
    }

    return children.map((folder: IFolderDescriptor) => {
        return (
            <TreeViewItem
                label={folder.label}
                nodeId={folder.uri}
                startIcon={<Folder />}>
                {getInnerFolders(folder.folders)}
            </TreeViewItem>
        )
    })
}

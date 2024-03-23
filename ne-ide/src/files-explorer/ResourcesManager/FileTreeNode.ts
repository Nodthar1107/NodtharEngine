export interface FileTreeNode {
    label: string;
    
    uri: string;

    resourceType: string;

    parent: FileTreeNode | null;
    
    children: FileTreeNode[];
}
import { ResourceType } from './ResourceType';

export interface IFileSystemNodeDescriptor {
    label: string;
    uri: string;
    resourceType: ResourceType;
}

export interface IOwnedDescriptor extends IFileSystemNodeDescriptor {
    parent: IFileSystemNodeDescriptor | null;
}

export interface IResourceDescriptor extends IOwnedDescriptor {
}

export interface IFolderDescriptor extends IOwnedDescriptor {
    folders: IFolderDescriptor[];
    resources: IResourceDescriptor[];
}

export function isFolderDescriptor(descriptor: IFileSystemNodeDescriptor): descriptor is IFolderDescriptor {
    return 'foldres' in descriptor && 'resources' in descriptor;
}
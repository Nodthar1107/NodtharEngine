import { ResourceType } from './ResourceType';

export interface IFileSystemNodeDescriptor {
    label: string;
    uri: string;
    resourceType: ResourceType;
}

export interface IOwnedDescriptor extends IFileSystemNodeDescriptor {
    parent: IFolderDescriptor | null;
}

export interface IResourceDescriptor extends IOwnedDescriptor {
}

export interface IFolderDescriptor extends IOwnedDescriptor {
    folders: IFolderDescriptor[];
    resources: IResourceDescriptor[];
}
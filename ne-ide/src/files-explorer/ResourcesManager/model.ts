import { URI } from 'src/core/utils/URI';
import { ResourceType } from './ResourceType';

export interface IFileSystemNodeDescriptor {
    label: string;
    uri: URI;
    resourceType: ResourceType;
    parent: IFileSystemNodeDescriptor | null;
}

export interface IResourceDescriptor extends IFileSystemNodeDescriptor {}

export interface IFolderDescriptor extends IFileSystemNodeDescriptor {
    folders: IFolderDescriptor[];
    resources: IResourceDescriptor[];
}

export function isFolderDescriptor(descriptor: IFileSystemNodeDescriptor): descriptor is IFolderDescriptor {
    return descriptor.resourceType === ResourceType.Folder;
}
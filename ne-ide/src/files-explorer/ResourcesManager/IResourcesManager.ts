import { IFileSystemNodeDescriptor, IFolderDescriptor } from './model';

export interface IResourcesManager {
    getRootFolder: () => IFolderDescriptor;
    getFileSystemNodeDescriptorByRelativePath: (relativePath: string) => IFileSystemNodeDescriptor | undefined;
    getFolderByRelativePath: (relativePath: string) => IFolderDescriptor | undefined;
}
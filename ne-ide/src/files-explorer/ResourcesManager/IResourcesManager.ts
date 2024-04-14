import { IFileSystemNodeDescriptor, IFolderDescriptor, IResourceDescriptor } from './model';

export interface IResourcesManager {
    getRootFolder: () => IFolderDescriptor; 
    getFileSystemNodeDescriptorByRelativePath: (relativePath: string) => IFileSystemNodeDescriptor | undefined;
    getFolderByRelativePath: (relativePath: string) => IFolderDescriptor | undefined;
    changeCurrentDirectory: (uri: string) => void;
    getCurrentFolderContent: () => { folders: IFolderDescriptor[]; resources: IResourceDescriptor[] };
}
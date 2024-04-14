import { IEventEmmiter } from '../events/IEventEmmiter';
import { IEventEmiterProvider } from '../events/IEventEmmiterProvider';
import { IFileSystemNodeDescriptor, IFolderDescriptor, IResourceDescriptor } from './model';

export interface IResourcesManager extends IEventEmiterProvider {
    getRootFolder: () => IFolderDescriptor; 

    changeCurrentDirectory: (uri: string) => void;

    getCurrentFolderContent: () => { folders: IFolderDescriptor[]; resources: IResourceDescriptor[] };

    addResourceToCurrentFolder: (resource: IFileSystemNodeDescriptor) => void;
}
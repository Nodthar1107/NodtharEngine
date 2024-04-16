import { IEventEmmiter } from '../events/IEventEmmiter';
import { IEventEmiterProvider } from '../events/IEventEmmiterProvider';
import { IFileSystemNodeDescriptor, IFolderDescriptor, IResourceDescriptor } from './model';

export interface IResourcesManager extends IEventEmiterProvider {
    getRootFolder: () => IFolderDescriptor | undefined; 

    changeCurrentDirectory: (uri: string) => void;

    setCurrentDirectory: (uri: string) => void;

    getCurrentFolderContent: () => { folders: IFolderDescriptor[]; resources: IResourceDescriptor[] } | undefined;

    addResourceToCurrentFolder: (resource: IFileSystemNodeDescriptor) => void;

    getCurrentFolder: () => Readonly<IFolderDescriptor> | undefined;
}
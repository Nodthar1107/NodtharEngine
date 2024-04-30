import { URI } from 'src/core/utils/URI';
import { IEventEmmiter } from '../events/IEventEmmiter';
import { IEventEmiterProvider } from '../events/IEventEmmiterProvider';
import { IFileSystemNodeDescriptor, IFolderDescriptor, IResourceDescriptor } from './model';

export interface IResourcesManager extends IEventEmiterProvider {
    getRootFolder: () => IFolderDescriptor | undefined; 

    changeCurrentDirectory: (uri: URI) => void;

    setCurrentDirectory: (uri: URI) => void;

    getCurrentFolderContent: () => { folders: IFolderDescriptor[]; resources: IResourceDescriptor[] } | undefined;

    addResourceToCurrentFolder: (resource: IFileSystemNodeDescriptor) => void;

    getCurrentFolder: () => Readonly<IFolderDescriptor> | undefined;

    renameElement: (uri: URI, label: string) => void;

    removeResourceByUri: (uri: URI) => void;
}
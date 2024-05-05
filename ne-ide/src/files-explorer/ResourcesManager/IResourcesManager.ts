import { URI } from 'src/core/utils/URI';
import { IEventEmitterProvider } from '../../core/utils/events/IEventEmitterProvider';
import { IFileSystemNodeDescriptor, IFolderDescriptor, IResourceDescriptor } from './model';
import { FileSystemEvents } from './events';

export interface IResourcesManager extends IEventEmitterProvider<FileSystemEvents> {
    getRootFolder: () => IFolderDescriptor | undefined; 

    changeCurrentDirectory: (uri: URI) => void;

    setCurrentDirectory: (uri: URI) => void;

    getCurrentFolderContent: () => { folders: IFolderDescriptor[]; resources: IResourceDescriptor[] } | undefined;

    addResourcesToCurrentFolder: (...resources: IFileSystemNodeDescriptor[]) => void;

    getCurrentFolder: () => Readonly<IFolderDescriptor> | undefined;

    renameElement: (uri: URI, label: string) => void;

    removeResourceByUri: (uri: URI) => void;

    getFileSystemNodeDescriptor: (uri: URI) => IFileSystemNodeDescriptor | undefined;
}
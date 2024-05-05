import { injectable } from 'inversify';

import { IFileSystemNodeDescriptor, IFolderDescriptor, IResourceDescriptor, isFolderDescriptor } from './model';
import { IResourcesManager } from './IResourcesManager';
import { ResourceType } from './ResourceType';

import { IEventEmitter } from '../../core/utils/events/IEventEmitter';
import { NotificationEvent } from '../../core/utils/events/NotificationEvent';
import { EventEmitter } from '../../core/utils/events/EventEmitter';
import { generateFolder, generateResource } from './resourceUtils';
import { URI } from '../../core/utils/URI';

import 'reflect-metadata';
import { FileSystemEvents } from './events';

@injectable()
export class ResourceManagerMockImpl implements IResourcesManager {
    private resourcesRoot: IFolderDescriptor = {
        label: '/',
        parent: null,
        resourceType: ResourceType.Folder,
        uri: URI.createURI('/', ''),
        folders: [],
        resources: []
    };
    private currentFolderDescriptor = this.resourcesRoot;
    private eventEmmiter = new EventEmitter<FileSystemEvents>();

    public constructor() {
        this.configureModel();
    }
    
    public getEventEmitter(): IEventEmitter<FileSystemEvents> {
        return this.eventEmmiter;
    }
    
    public getRootFolder(): IFolderDescriptor {
        return this.resourcesRoot;
    }

    public getCurrentFolder(): Readonly<IFolderDescriptor> | undefined {
        return this.currentFolderDescriptor;
    }

    public addResourcesToCurrentFolder(...resources: IFileSystemNodeDescriptor[]) {
        resources.forEach((resource: IResourceDescriptor) => {
            this.putNodeToFolder(this.currentFolderDescriptor, resource);
            if (isFolderDescriptor(resource)) {
                this.currentFolderDescriptor = resource;

                this.eventEmmiter.fireEvents([
                    new NotificationEvent(FileSystemEvents.TREE_VIEW_UPDATED),
                    new NotificationEvent(FileSystemEvents.FOLDER_CONTENT_UPDATED)]
                );

                return;
            }
        });

        this.eventEmmiter.fireEvent(new NotificationEvent(FileSystemEvents.FOLDER_CONTENT_UPDATED));
    }

    public changeCurrentDirectory(uri: URI) {
        const folder = this.getFolderByRelativePath(uri.toString());
        if (folder === undefined) {
            return;
        }

        this.currentFolderDescriptor = folder;
        this.eventEmmiter.fireEvent(new NotificationEvent(FileSystemEvents.FOLDER_CONTENT_UPDATED));
    }

    public setCurrentDirectory(uri: URI) {
        this.changeCurrentDirectory(uri);

        this.eventEmmiter.fireEvent(new NotificationEvent(FileSystemEvents.TREE_VIEW_UPDATED));
    }

    public getCurrentFolderContent(): { folders: IFolderDescriptor[]; resources: IResourceDescriptor[] } | undefined {
        return {
            folders: this.currentFolderDescriptor.folders,
            resources: this.currentFolderDescriptor.resources
        };
    }

    public removeResourceByUri(uri: URI) {
        const node = this.getFileSystemNodeDescriptor(uri);
        if (!node) {
            return;
        }

        const ownedNode = node as IFileSystemNodeDescriptor; 
        if (!(node as IFileSystemNodeDescriptor).parent) {
            return;
        }

        if (ownedNode.resourceType === ResourceType.Folder) {
            (ownedNode.parent as IFolderDescriptor).folders.splice(
                (ownedNode.parent as IFolderDescriptor).folders.indexOf(ownedNode as IFolderDescriptor),
                1
            );

            if (ownedNode === this.currentFolderDescriptor) {
                this.currentFolderDescriptor = ownedNode.parent as IFolderDescriptor;
            }
        } else {
            (ownedNode.parent as IFolderDescriptor).resources.splice(
                (ownedNode.parent as IFolderDescriptor).resources.indexOf(ownedNode as IResourceDescriptor),
                1
            );
        }

        this.eventEmmiter.fireEvent(new NotificationEvent(FileSystemEvents.TREE_VIEW_UPDATED));
        this.eventEmmiter.fireEvent(new NotificationEvent(FileSystemEvents.FOLDER_CONTENT_UPDATED));        
    }

    public renameElement(uri: URI, label: string) {
        const node = this.getFileSystemNodeDescriptor(uri);

        if (node === undefined) {
            return;
        }

        node.label = label;
        node.uri = URI.createURI(node.uri.path, label, node.uri.extension);

        if (isFolderDescriptor(node)) {
            this.updateFolderChildrenUris(node);

            const parent = node.parent as IFolderDescriptor;
            if (parent !== null) {
                if (isFolderDescriptor(node as IFileSystemNodeDescriptor)) {
                    parent.folders.sort(this.sortNodesByName);
                }
            }
        }

        this.eventEmmiter.fireEvents([
            new NotificationEvent(FileSystemEvents.TREE_VIEW_UPDATED),
            new NotificationEvent(FileSystemEvents.FOLDER_CONTENT_UPDATED)]
        );
    }

    private configureModel() {
        this.putNodeToFolderByPath(
            generateFolder('test-folder-1'),
            '/'
        ).putNodeToFolderByPath(
            generateFolder('test-folder-2'),
            '/'
        ).putNodeToFolderByPath(
            generateResource('SceneBlueprint', ResourceType.Blueprint),
            '/'
        ).putNodeToFolderByPath(
            generateFolder('models'),
            '/test-folder-1'
        ).putNodeToFolderByPath(
            generateResource('Sphere', ResourceType.Model),
            '/test-folder-1/models'
        ).putNodeToFolderByPath(
            generateResource('Box', ResourceType.Model),
            '/test-folder-1/models'
        ).putNodeToFolderByPath(
            generateResource('Cone', ResourceType.Model),
            '/test-folder-1/models'
        ).putNodeToFolderByPath(
            generateResource('3DObjBlueprint', ResourceType.Blueprint),
            '/test-folder-1'
        ).putNodeToFolderByPath(
            generateResource('FooBlock', ResourceType.SourceJava),
            '/test-folder-1'
        );
    }

    private  getFolderByRelativePath(relativePath: string): IFolderDescriptor | undefined {
        if (relativePath === '/') {
            return this.resourcesRoot;
        }

        const pathFragments = relativePath.split('/').slice(1);
        let taregtElement: IFolderDescriptor | undefined = this.resourcesRoot;
        for (const folderName of pathFragments) {
            taregtElement = taregtElement?.folders?.find((folder: IFolderDescriptor) => {
                return folder.label === folderName;
            });

            if (!taregtElement) {
                return undefined;
            }
        }

        return taregtElement;
    }

    public getFileSystemNodeDescriptor(uri: URI): IFileSystemNodeDescriptor | undefined {
        if (uri.isResource()) {
            const folder = this.getFolderByRelativePath(uri.path);
            if (folder !== undefined) {
                const targetResource = folder.resources.find((resource: IResourceDescriptor) => {
                    return resource.uri.equals(uri);
                });

                return targetResource
            }
        }

        return this.getFolderByRelativePath(uri.toString());
    }

    private putNodeToFolder(folder: IFolderDescriptor, node: IFileSystemNodeDescriptor) {
        if (isFolderDescriptor(node)) {
            folder.folders.push(node);
            folder.folders.sort(this.sortNodesByName);
        } else {
            folder.resources.push(node);
            folder.resources.sort(this.sortNodesByName);
        }

        node.parent = folder;
        node.uri = URI.createURI((folder.uri.toString()), node.uri.resourceName, node.uri.extension);
    }

    private putNodeToFolderByPath(resource: IFileSystemNodeDescriptor, path: string): ResourceManagerMockImpl {
        const taregtElement = this.getFolderByRelativePath(path);
        if (taregtElement === undefined) {
            return this;
        }

        this.putNodeToFolder(taregtElement as IFolderDescriptor, resource);
        
        return this;
    }

    private updateFolderChildrenUris(node: IFolderDescriptor) {
        node.resources.forEach((resource: IResourceDescriptor) => {
            resource.uri = URI.resolvePath(node.uri.toString(), resource.uri); 
        });
        node.folders.forEach((folder: IFolderDescriptor) => {
            folder.uri = URI.resolvePath(node.uri.toString(), folder.uri);
            this.updateFolderChildrenUris(folder);
        })
    }

    private sortNodesByName(first: IFileSystemNodeDescriptor, second: IFileSystemNodeDescriptor) {
        return first.label > second.label ? 1 : -1;
    }
}
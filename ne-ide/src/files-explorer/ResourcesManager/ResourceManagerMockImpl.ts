import { injectable } from 'inversify';

import { IFileSystemNodeDescriptor, IFolderDescriptor, IOwnedDescriptor, IResourceDescriptor, isFolderDescriptor } from './model';
import { IResourcesManager } from './IResourcesManager';
import { ResourceType } from './ResourceType';

import 'reflect-metadata';
import { IEventEmmiter } from '../events/IEventEmmiter';
import { EventType, NotificationEvent } from '../events/NotificationEvent';
import { EventEmmiter } from '../events/EventEmmiter';
import { generateFolder, generateResource } from './resourceUtils';

@injectable()
export class ResourceManagerMockImpl implements IResourcesManager {
    private resourcesRoot: IFolderDescriptor = {
        label: '/',
        parent: null,
        resourceType: ResourceType.Folder,
        uri: '/',
        folders: [],
        resources: []
    }
    private currentFolderDescriptor = this.resourcesRoot;
    private eventEmmiter = new EventEmmiter();

    public constructor() {
        this.configureModel();
    }

    public getEventEmmiter(): IEventEmmiter {
        return this.eventEmmiter;
    }
    
    public getRootFolder(): IFolderDescriptor {
        return this.resourcesRoot;
    }

    public getCurrentFolder(): Readonly<IFolderDescriptor> | undefined {
        return this.currentFolderDescriptor;
    }

    public addResourceToCurrentFolder(resource: IFileSystemNodeDescriptor) {
        if (isFolderDescriptor(resource)) {
            this.putResourceToFolder(this.currentFolderDescriptor, resource);
            this.currentFolderDescriptor = resource;

            this.eventEmmiter.fireEvents([
                new NotificationEvent(EventType.TREE_VIEW_UPDATED),
                new NotificationEvent(EventType.FOLDER_CONTENT_UPDATED)]
            );

            return;
        }

        this.currentFolderDescriptor.resources.push(resource as IResourceDescriptor);
        this.eventEmmiter.fireEvent(new NotificationEvent(EventType.FOLDER_CONTENT_UPDATED));
    }

    public changeCurrentDirectory(uri: string) {
        const folder = this.getFolderByRelativePath(uri);
        if (folder === undefined) {
            return;
        }

        this.currentFolderDescriptor = folder;
        this.eventEmmiter.fireEvent(new NotificationEvent(EventType.FOLDER_CONTENT_UPDATED));
    }

    public setCurrentDirectory(uri: string) {
        this.changeCurrentDirectory(uri);

        this.eventEmmiter.fireEvent(new NotificationEvent(EventType.TREE_VIEW_UPDATED));
    }

    public getCurrentFolderContent(): { folders: IFolderDescriptor[]; resources: IResourceDescriptor[] } | undefined {
        return {
            folders: this.currentFolderDescriptor.folders,
            resources: this.currentFolderDescriptor.resources
        };
    }

    public removeResourceByUri(uri: string) {
        const node = this.getFileSystemNodeDescriptorByRelativePath(uri);
        if (!node) {
            return;
        }

        const ownedNode = node as IOwnedDescriptor; 
        if (!(node as IOwnedDescriptor).parent) {
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

        this.eventEmmiter.fireEvent(new NotificationEvent(EventType.TREE_VIEW_UPDATED));
        this.eventEmmiter.fireEvent(new NotificationEvent(EventType.FOLDER_CONTENT_UPDATED));        
    }

    private configureModel() {
        this.putResourceToFolderByPath(
            generateFolder('test-folder-1'),
            '/'
        ).putResourceToFolderByPath(
            generateFolder('test-folder-2'),
            '/'
        ).putResourceToFolderByPath(
            generateResource('SceneBlueprint.bp', ResourceType.Blueprint),
            '/'
        ).putResourceToFolderByPath(
            generateFolder('models'),
            '/test-folder-1'
        ).putResourceToFolderByPath(
            generateResource('Sphere.obj', ResourceType.Model),
            '/test-folder-1/models'
        ).putResourceToFolderByPath(
            generateResource('Box.obj', ResourceType.Model),
            '/test-folder-1/models'
        ).putResourceToFolderByPath(
            generateResource('Cone.obj', ResourceType.Model),
            '/test-folder-1/models'
        ).putResourceToFolderByPath(
            generateResource('3DObjBlueprint.bp', ResourceType.Blueprint),
            '/test-folder-1'
        ).putResourceToFolderByPath(
            generateResource('FooBlock.java', ResourceType.SourceJava),
            '/test-folder-1'
        );
    }

    private getFileSystemNodeDescriptorByRelativePath(relativePath: string): IFileSystemNodeDescriptor | undefined {
        if (relativePath === '/') {
            return this.resourcesRoot;
        }

        const foldersList = relativePath.split('/').slice(1);
        let taregtElement: IFolderDescriptor | undefined = this.resourcesRoot;
        for (const folderName of foldersList) {
            taregtElement = taregtElement?.folders?.find((folder: IResourceDescriptor) => {
                return folder.label === folderName;
            });

            if (!taregtElement) {
                return undefined;
            }
        }

        return taregtElement;
    }

    private getFolderByRelativePath(relativePath: string): IFolderDescriptor | undefined {
        const node = this.getFileSystemNodeDescriptorByRelativePath(relativePath);

        if (node === undefined || node.resourceType !== ResourceType.Folder) {
            return undefined;
        }

        return node as IFolderDescriptor;
    }

    private putResourceToFolder(folder: IFolderDescriptor, resource: IOwnedDescriptor) {
        resource.resourceType === ResourceType.Folder
            ? folder.folders?.push(resource as IFolderDescriptor)
            : folder.resources?.push(resource as IResourceDescriptor);

        resource.parent = folder;
        resource.uri = (!!folder.parent ? folder.uri + '/' : '/') + resource.label;
    }

    private putResourceToFolderByPath(resource: IOwnedDescriptor, path: string): ResourceManagerMockImpl {
        const taregtElement = this.getFolderByRelativePath(path);
        if (taregtElement === undefined) {
            return this;
        }

        this.putResourceToFolder(taregtElement as IFolderDescriptor, resource);
        
        return this;
    }
}
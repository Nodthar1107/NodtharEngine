import { injectable } from 'inversify';

import { IFileSystemNodeDescriptor, IFolderDescriptor, IOwnedDescriptor, IResourceDescriptor } from './model';
import { IResourcesManager } from './IResourcesManager';
import { ResourceType } from './ResourceType';

import 'reflect-metadata';

@injectable()
export class ResourceManagerMockImpl implements IResourcesManager {
    private resourcesModel: IFolderDescriptor = {
        label: '/',
        parent: null,
        resourceType: ResourceType.Folder,
        uri: '/',
        folders: [],
        resources: []
    }
    private isInitialized: boolean = false
    
    public getRootFolder(): IFolderDescriptor {
        if (!this.isInitialized) {
            this.configureModel();
            this.isInitialized = true;
        }

        return this.resourcesModel;
    }

    public getFileSystemNodeDescriptorByRelativePath(relativePath: string): IFileSystemNodeDescriptor | undefined {
        if (relativePath === '/') {
            return this.resourcesModel;
        }

        const foldersList = relativePath.split('/').slice(1);
        let taregtElement: IFolderDescriptor | undefined = this.resourcesModel;
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

    public getFolderByRelativePath(relativePath: string): IFolderDescriptor | undefined {
        const node = this.getFileSystemNodeDescriptorByRelativePath(relativePath);

        if (node === undefined || node.resourceType !== ResourceType.Folder) {
            return undefined;
        }

        return node as IFolderDescriptor;
    }

    private configureModel() {
        this.putResourceToFolderByPath(
            this.generateFolder('test-folder-1'),
            '/'
        ).putResourceToFolderByPath(
            this.generateFolder('test-folder-2'),
            '/'
        ).putResourceToFolderByPath(
            this.generateResource('SceneBlueprint.bp', ResourceType.Blueprint),
            '/'
        ).putResourceToFolderByPath(
            this.generateFolder('models'),
            '/test-folder-1'
        ).putResourceToFolderByPath(
            this.generateResource('Sphere.obj', ResourceType.Model),
            '/test-folder-1/models'
        ).putResourceToFolderByPath(
            this.generateResource('Box.obj', ResourceType.Model),
            '/test-folder-1/models'
        ).putResourceToFolderByPath(
            this.generateResource('Cone.obj', ResourceType.Model),
            '/test-folder-1/models'
        ).putResourceToFolderByPath(
            this.generateResource('3DObjBlueprint.bp', ResourceType.Blueprint),
            '/test-folder-1'
        ).putResourceToFolderByPath(
            this.generateResource('FooBlock.java', ResourceType.SourceJava),
            '/test-folder-1'
        );
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

    private generateResource(label: string, type: ResourceType): IResourceDescriptor {
        return {
            label: label,
            parent: null,
            uri: '',
            resourceType: type
        }
    }

    private generateFolder(label: string): IFolderDescriptor {
        return {
            label: label,
            parent: null,
            uri: '',
            resourceType: ResourceType.Folder,
            folders: [],
            resources: []
        }
    }
}
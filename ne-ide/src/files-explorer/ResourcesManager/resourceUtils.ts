import { IFolderDescriptor, IResourceDescriptor } from './model'
import { ResourceType } from './ResourceType'

export function generateResource(label: string, type: ResourceType): IResourceDescriptor {
    return {
        label: label,
        parent: null,
        uri: '',
        resourceType: type
    }
}

export function generateFolder(label: string): IFolderDescriptor {
    return {
        label: label,
        parent: null,
        uri: '',
        resourceType: ResourceType.Folder,
        folders: [],
        resources: []
    }
}
import { URI } from '../../core/utils/URI'
import { ResourceUtils } from '../../core/utils/ResourceUtils'
import { IFolderDescriptor, IResourceDescriptor } from './model'
import { ResourceType } from './ResourceType'

export function generateResource(label: string, type: ResourceType): IResourceDescriptor {
    return {
        label: label,
        parent: null,
        uri: URI.createURI('', label, ResourceUtils.resolveExtensionByType(type)),
        resourceType: type
    }
}

export function generateFolder(label: string): IFolderDescriptor {
    return {
        label: label,
        parent: null,
        uri: URI.createURI('', label, undefined),
        resourceType: ResourceType.Folder,
        folders: [],
        resources: []
    }
}
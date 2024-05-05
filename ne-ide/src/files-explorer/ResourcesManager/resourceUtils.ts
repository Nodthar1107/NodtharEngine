import { URI } from '../../core/utils/URI'
import { IFolderDescriptor, IResourceDescriptor } from './model'
import { ResourceType } from './ResourceType'

export function generateResource(label: string, type: ResourceType): IResourceDescriptor {
    return {
        label: label,
        parent: null,
        uri: URI.createURI('', label, resolveExtensionByType(type)),
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

export function getResourceTypeFromUri(uri: URI): ResourceType {
    if (uri === undefined || uri.extension === undefined) {
        return ResourceType.File;
    }
    
    if (uri.extension === 'java') {
        return ResourceType.SourceJava;
    }

    if (uri.extension === 'bp') {
        return ResourceType.Blueprint;
    }

    if (uri.extension === 'obj') {
        return ResourceType.Model
    }

    if (/(jpg|jpeg|png)/.test(uri.extension)) {
        return ResourceType.Picture
    }

    if (uri.extension === 'json') {
        return ResourceType.Json;
    }

    return ResourceType.File;
}

function resolveExtensionByType(type: ResourceType): string {
    switch(type) {
        case ResourceType.Blueprint:
            return 'bp';
        case ResourceType.Json:
            return 'json';
        case ResourceType.SourceJava:
            return 'java';
        case ResourceType.Model:
            return 'obj';
        default:
            return '';
    }
}

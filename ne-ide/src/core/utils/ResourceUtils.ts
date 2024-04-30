import { ResourceType } from '../../files-explorer/ResourcesManager/ResourceType';

export class ResourceUtils {
    public static resolveExtensionByType(type: ResourceType): string {
        switch(type) {
            case ResourceType.Blueprint:
                return 'bp';
            case ResourceType.JsonFile:
                return 'json';
            case ResourceType.SourceJava:
                return 'java';
            case ResourceType.Model:
                return 'obj';
            default:
                return '';
        }
    }
}
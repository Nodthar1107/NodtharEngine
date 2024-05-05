import { URI } from '../core/utils/URI';

export interface IEditorDescriptor {
    label: string;
    uri: URI;
    closable: boolean;
}
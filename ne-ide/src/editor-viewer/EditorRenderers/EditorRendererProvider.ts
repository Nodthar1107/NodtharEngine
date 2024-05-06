import * as React from 'react';

import { ResourceType } from '../../files-explorer/ResourcesManager/ResourceType';
import { IEditorDescriptor } from '../model';
import { IAbstratcEditorProps, IEditor } from './AbstractEditor';
import { getResourceTypeFromUri } from '../../files-explorer/ResourcesManager/resourceUtils';
import { TextEditor } from './TextEditor';
import { injectable } from 'inversify';

import 'reflect-metadata';

export interface IEditorRendererProvider {
    registerEditor: (type: ResourceType, editor: IEditor) => void;

    provideRenderer: (
        editorDescriptor: IEditorDescriptor,
        props?: IAbstratcEditorProps
    ) => React.ReactElement<IAbstratcEditorProps>;
}

@injectable()
export class EditorRendererProvider implements IEditorRendererProvider {
    private editorRendererMapper: Map<ResourceType, IEditor> = new Map();

    public registerEditor(type: ResourceType, editor: IEditor) {
        this.editorRendererMapper.set(type, editor);
    }

    public provideRenderer(
        editorDescriptor: IEditorDescriptor,
        props?: IAbstratcEditorProps
    ): React.ReactElement<IAbstratcEditorProps> {
        const type = getResourceTypeFromUri(editorDescriptor.uri);
        const editor = this.editorRendererMapper.get(type);

        return editor
            ? React.createElement(editor as React.ComponentClass, props)
            : React.createElement(TextEditor, props);
    }  
}

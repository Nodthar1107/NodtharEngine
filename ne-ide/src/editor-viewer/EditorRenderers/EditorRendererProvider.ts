import * as React from 'react';

import { ResourceType } from '../../files-explorer/ResourcesManager/ResourceType';
import { IEditorDescriptor } from '../model';
import { IAbstratcEditorProps } from './AbstractEditor';
import { getResourceTypeFromUri } from '../../files-explorer/ResourcesManager/resourceUtils';
import { TextEditor } from './TextEditor';
import { EDITOR_VIEWER_MODULE } from '../module-types';
import { injectable, multiInject } from 'inversify';

import 'reflect-metadata';
import { render } from 'react-dom';

export interface IEditorRendererProvider {
    getRenderer: (props?: IAbstratcEditorProps) => React.ReactElement;
    getEditorType: () => ResourceType;
}

export interface IEditorRendererProviderService {
    provideRenderer: (
        editorDescriptor: IEditorDescriptor,
        props?: IAbstratcEditorProps
    ) => React.ReactElement<IAbstratcEditorProps>;
}

@injectable()
export class EditorRendererProvider implements IEditorRendererProviderService {
    private editorRendererMapper: Map<ResourceType, IEditorRendererProvider> = new Map();

    constructor(@multiInject(EDITOR_VIEWER_MODULE.IEditorRendererProvider) providers: IEditorRendererProvider[]) {
        providers.forEach((provider: IEditorRendererProvider) => {
            this.editorRendererMapper.set(provider.getEditorType(), provider);
        });
    }

    public provideRenderer(
        editorDescriptor: IEditorDescriptor,
        props?: IAbstratcEditorProps
    ): React.ReactElement<IAbstratcEditorProps> {
        const type = getResourceTypeFromUri(editorDescriptor.uri);
        const renderer = this.editorRendererMapper.get(type);

        return renderer
            ? renderer.getRenderer(props)
            : React.createElement(TextEditor, props);
    }  
}

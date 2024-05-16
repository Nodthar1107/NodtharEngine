import * as React from 'react';

import { IEditorDescriptor } from '../model';
import { IEditorRendererProviderService } from './EditorRendererProvider';

interface IEditorRendererProps {
    editorRendererProvider: IEditorRendererProviderService;
    editorDescriptor: IEditorDescriptor;
}

export class EditorRenderer extends React.Component<IEditorRendererProps> {
    constructor(props: IEditorRendererProps) {
        super(props);
    }

    public render(): React.ReactNode {
        return this.props.editorRendererProvider.provideRenderer(
            this.props.editorDescriptor, {
                uri: this.props.editorDescriptor.uri.toString()
        });
    }    
}
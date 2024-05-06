import { ReactNode } from 'react';
import { AbstractEditor, IAbstratcEditorProps } from '../editor-viewer/EditorRenderers/AbstractEditor';
import { ResourceType } from '../files-explorer/ResourcesManager/ResourceType';
import { injectable } from 'inversify';
import { IEditorRendererProvider } from 'src/editor-viewer/EditorRenderers/EditorRendererProvider';
import 'reflect-metadata';

import './style.scss';

interface IBlueprintEditorProps extends IAbstratcEditorProps {

}

export class BlueprintEditor extends AbstractEditor<IAbstratcEditorProps, {}> {
    constructor(props: IAbstratcEditorProps) {
        super(props);
    }

    /** @override */
    public getEditableResourceType(): ResourceType {
        return ResourceType.Blueprint;
    }

    /** @override */
    public render(): ReactNode {
        return (
            <div className='blueprint-editor'>

            </div>
        );
    }
}

@injectable()
export class BlueprintEditorProvider implements IEditorRendererProvider {
    public getRenderer(props?: IAbstratcEditorProps | undefined): React.ReactElement {
        return <BlueprintEditor {...props} />
    }

    public getEditorType(): ResourceType {
        return ResourceType.Blueprint;
    }
}

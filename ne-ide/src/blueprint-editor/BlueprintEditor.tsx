import * as React from 'react';
import { inject, injectable } from 'inversify';
import { AbstractEditor, IAbstratcEditorProps } from '../editor-viewer/EditorRenderers/AbstractEditor';
import { ResourceType } from '../files-explorer/ResourcesManager/ResourceType';
import { IEditorRendererProvider } from '../editor-viewer/EditorRenderers/EditorRendererProvider';
import { IDialogService } from '../core/services/DialogService/IDialogService';
import { BlueprintsListView } from './BlueprintsListView';
import { CORE_TYPES } from '../core/module-types';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';

import 'reflect-metadata';
import './style.scss';
import { BLUEPRINT_EDITOR_MODULE } from './module-types';
import { ICustomDialogBaseProps } from 'src/core/services/DialogService/DialogServiceRenderer';

interface IBlueprintEditorProps extends IAbstratcEditorProps {
    dialogService: IDialogService;
    blueprintsInfoProvider: IBlueprintsInfoProvider;
}

interface IBlueprintElementState {

}

export class BlueprintEditor extends AbstractEditor<IBlueprintEditorProps, {}> {
    constructor(props: IBlueprintEditorProps) {
        super(props);
    }

    /** @override */
    public getEditableResourceType(): ResourceType {
        return ResourceType.Blueprint;
    }

    /** @override */
    public render(): React.ReactNode {
        return (
            <div
                className='blueprint-editor'
                onContextMenu={(event: React.MouseEvent) => { this.onContext(event) }}>

            </div>
        );
    }

    private onContext(event: React.MouseEvent) {
        event.preventDefault();
        const blueprintsDescriptors = this.props.blueprintsInfoProvider.getBlueprintsDescriptors(); 

        this.props.dialogService.showCustomDialog(
            BlueprintsListView as React.FC<ICustomDialogBaseProps>,
            event, {
            descriptors: blueprintsDescriptors
        });
    }
}

@injectable()
export class BlueprintEditorProvider implements IEditorRendererProvider {
    private dialogService: IDialogService;
    private blueprintsInfoProvider: IBlueprintsInfoProvider;

    constructor(
        @inject(CORE_TYPES.IDialogService) dialogService: IDialogService,
        @inject(BLUEPRINT_EDITOR_MODULE.IBlueprintsInfoProvider) blueprintsInfoProvider: IBlueprintsInfoProvider
    ) {
        this.dialogService = dialogService;
        this.blueprintsInfoProvider = blueprintsInfoProvider;
    }

    public getRenderer(): React.ReactElement {
        return (
            <BlueprintEditor
                blueprintsInfoProvider={this.blueprintsInfoProvider}
                dialogService={this.dialogService}
            />
        );
    }

    public getEditorType(): ResourceType {
        return ResourceType.Blueprint;
    }
}

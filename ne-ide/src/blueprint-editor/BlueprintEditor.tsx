import * as React from 'react';
import { inject, injectable } from 'inversify';
import { AbstractEditor, IAbstratcEditorProps } from '../editor-viewer/EditorRenderers/AbstractEditor';
import { ResourceType } from '../files-explorer/ResourcesManager/ResourceType';
import { IEditorRendererProvider } from '../editor-viewer/EditorRenderers/EditorRendererProvider';
import { IDialogService } from '../core/services/DialogService/IDialogService';
import { BlueprintsListView, IBlueprintsListViewProps } from './BlueprintsListView';
import { CORE_TYPES } from '../core/module-types';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';

import 'reflect-metadata';
import './style.scss';
import { BLUEPRINT_EDITOR_MODULE } from './module-types';
import { ICustomDialogBaseProps } from 'src/core/services/DialogService/DialogServiceRenderer';
import { BlueprintEditorOperationType, IBlueprintNode, IDragEditorOperation, IEditorOperation, IPlaceElementOperation } from './model';
import { BlueprintNode } from './BluprintNode';

interface ICoords {
    x: number,
    y: number
}

interface IBlueprintEditorProps extends IAbstratcEditorProps {
    dialogService: IDialogService;
    blueprintsInfoProvider: IBlueprintsInfoProvider;
}

interface IBlueprintEditorState {
    operation: IEditorOperation | null;
    nodes: IBlueprintNode[];
    centerOffset: ICoords;
    isDrugging: boolean;
}

export class BlueprintEditor extends AbstractEditor<IBlueprintEditorProps, IBlueprintEditorState> {
    constructor(props: IBlueprintEditorProps) {
        super(props);

        this.state = {
            operation: null,
            nodes: this.props.blueprintsInfoProvider.getBlueprintsNodes(this.props.uri),
            centerOffset: {
                x: 0,
                y: 0
            },
            isDrugging: false
        }
    }

    /** @override */
    public getEditableResourceType(): ResourceType {
        return ResourceType.Blueprint;
    }

    /** @override */
    public render(): React.ReactNode {
        return (
            <div
                onContextMenu={(event: React.MouseEvent) => { this.onContext(event) }}
                {...this.getSpecialProps()}>
                {this.renderNodes()}
            </div>
        );
    }

    private renderCommands(): React.ReactNode {
        return <></>;
    }

    private renderNodes(): React.ReactNode {
        return this.state.nodes.map((node: IBlueprintNode, index: number) => {
            return (
                <BlueprintNode
                    label={node.label}
                    description={node.description}
                    nodeId={node.nodeId}
                    posX={node.posX + this.state.centerOffset.x}
                    posY={node.posY + this.state.centerOffset.y}
                    schema={node.schema}
                    type={node.type}
                    key={index}
                />
            );
        });
    }

    private getSpecialProps() {
        const baseProps = {
            className: 'blueprint-editor',
            onMouseDown: this.onDrugStart.bind(this),
        };
        
        if (this.state.operation) {
            switch (this.state.operation.type) {
                case BlueprintEditorOperationType.PlaceElement:
                    return {
                        onClick: (event: React.MouseEvent) => this.onBlueprintNodePlace(event),
                        className: `${baseProps.className} ${baseProps.className}_place-node`
                    };
                case BlueprintEditorOperationType.DragEditor:
                    return {
                        className: `${baseProps.className} ${baseProps.className}_draggable`,
                        onMouseUp: () => { this.setState({ isDrugging: false, operation: null }) },
                        onMouseLeave: () => { this.setState({ isDrugging: false, operation: null }) },
                        onMouseMove: (event: React.MouseEvent) => { this.onMouseMove(event) }
                    }
            }
        }

        return baseProps;
    }

    private onContext(event: React.MouseEvent) {
        event.preventDefault();

        const listViewProps: IBlueprintsListViewProps = {
            descriptors: this.props.blueprintsInfoProvider.getBlueprintsLibrary(),
            onNodeSelect: this.onContextNodeSelect.bind(this)
        };
        this.props.dialogService.showCustomDialog(
            BlueprintsListView as React.FC<ICustomDialogBaseProps>,
            event,
            listViewProps
        );
    }

    private onContextNodeSelect(nodeId: string) {
        const operation: IPlaceElementOperation = {
            type: BlueprintEditorOperationType.PlaceElement,
            nodeId: nodeId
        };

        this.setState({
            operation: operation
        });
    }

    private onBlueprintNodePlace(event: React.MouseEvent) {
        const placeElementOperation = this.state.operation as IPlaceElementOperation;
        const node = this.props.blueprintsInfoProvider.createNodeById(placeElementOperation.nodeId);
        node.posX = event.clientX;
        node.posY = event.clientY;

        const nodes = this.state.nodes.slice();
        nodes.push(node);

        this.setState({
            operation: null,
            nodes: nodes
        });
    }

    private onDrugStart() {
        this.setState({
            isDrugging: true,
            operation: {
                type: BlueprintEditorOperationType.DragEditor
            } as IDragEditorOperation
        })
    }

    private onMouseMove(event: React.MouseEvent) {
        if (this.state.isDrugging) {
            const currentoffset = this.state.centerOffset;
            this.setState({
                centerOffset: {
                    x: currentoffset.x + event.movementX,
                    y: currentoffset.y + event.movementY
                }
            });
        }
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

    public getRenderer(props: IAbstratcEditorProps): React.ReactElement {
        return (
            <BlueprintEditor
                uri={props.uri}
                blueprintsInfoProvider={this.blueprintsInfoProvider}
                dialogService={this.dialogService}
            />
        );
    }

    public getEditorType(): ResourceType {
        return ResourceType.Blueprint;
    }
}

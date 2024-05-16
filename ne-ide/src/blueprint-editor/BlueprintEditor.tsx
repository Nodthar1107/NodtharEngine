import * as React from 'react';
import { inject, injectable } from 'inversify';
import { JsonFormsCore } from '@jsonforms/core';
import { AbstractEditor, IAbstratcEditorProps } from '../editor-viewer/EditorRenderers/AbstractEditor';
import { ResourceType } from '../files-explorer/ResourcesManager/ResourceType';
import { IEditorRendererProvider } from '../editor-viewer/EditorRenderers/EditorRendererProvider';
import { IDialogService } from '../core/services/DialogService/IDialogService';
import { BlueprintsListView, IBlueprintsListViewProps } from './BlueprintsListView';
import { CORE_TYPES } from '../core/module-types';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';
import { BLUEPRINT_EDITOR_MODULE } from './module-types';
import { ICustomDialogBaseProps } from '../core/services/DialogService/DialogServiceRenderer';
import {
    BlueprintEditorOperationType,
    BlueprintType,
    IAssignedModelDescriptor,
    IBlueprintNode,
    IBlueprintPipelineLink,
    ICreateLinkOperation,
    IDragEditorOperation,
    IDragNodeOperation,
    IEditorOperation,
    IPlaceElementOperation
} from './model';
import { BlueprintNode } from './BluprintNode';
import { ISubscriber } from '../core/utils/events/ISubscriber';
import { BlueprintEditorEvents } from './events';
import { NotificationEvent } from 'src/core/utils/events/NotificationEvent';
import { ILinkInfo, INodeId } from './BlueprintsEditorCommandsContribution';
import { IIconsProvider } from '../core/providers/IIconsProvider';
import { createPipelineLink } from './utils';
import { BlueprintPipelineLink } from './BlueprintPipelineLink';
import { Debouncer } from '../core/utils/Debouncer';

import './style.scss';
import { AvailabelPropertiesPanel } from './AvailabelPropertiesPanel';

interface ICoords {
    x: number,
    y: number
}

interface IBlueprintEditorProps extends IAbstratcEditorProps {
    dialogService: IDialogService;
    blueprintsInfoProvider: IBlueprintsInfoProvider;
    iconProvider: IIconsProvider;
}

interface IBlueprintEditorState {
    previousUri: string;
    operation: IEditorOperation | null;
    type: BlueprintType;
    modelDescriptor?: IAssignedModelDescriptor;
    nodes: IBlueprintNode[];
    links: IBlueprintPipelineLink[];
    centerOffset: ICoords;
}

export class BlueprintEditor
    extends AbstractEditor<IBlueprintEditorProps, IBlueprintEditorState>
    implements ISubscriber<BlueprintEditorEvents>
{
    private editorRef = React.createRef<HTMLDivElement>();
    private debouncer = new Debouncer();

    constructor(props: IBlueprintEditorProps) {
        super(props);

        const blueprintDescriptor = this.props.blueprintsInfoProvider.getBlueprintsDataByUri(props.uri);
        this.state = {
            previousUri: this.props.uri,
            operation: null,
            type: blueprintDescriptor.type,
            modelDescriptor: undefined,
            nodes: blueprintDescriptor.nodes,
            links: blueprintDescriptor.links,
            centerOffset: {
                x: 0,
                y: 0
            }
        }
    }

    public static getDerivedStateFromProps(
        props: IBlueprintEditorProps,
        state: IBlueprintEditorState
    ): IBlueprintEditorState | null {
        if (props.uri !== state.previousUri) {
            const blueprintDescriptor = props.blueprintsInfoProvider.getBlueprintsDataByUri(props.uri);

            return {
                type: blueprintDescriptor.type,
                nodes: blueprintDescriptor.nodes,
                links: blueprintDescriptor.links,
                centerOffset: {
                    x: 0,
                    y: 0
                },
                operation: null,
                previousUri: props.uri
            }
        }

        return null;
    }

    /** @override */
    public fireEvent(event: NotificationEvent<BlueprintEditorEvents>) {
        if (event.type === BlueprintEditorEvents.BluprintUpdated) {
            const blueprintDescriptor = this.props.blueprintsInfoProvider.getBlueprintsDataByUri(this.props.uri);
            this.setState({
                type: blueprintDescriptor.type,
                nodes: blueprintDescriptor.nodes,
                links: blueprintDescriptor.links,
            });
        }
    }

    /** @override */
    public getEditableResourceType(): ResourceType {
        return ResourceType.Blueprint;
    }

    /** @override */
    public componentDidMount(): void {
        this.props.blueprintsInfoProvider.getEventEmitter().subscribe(this);
    }

    /** @override */
    public render(): React.ReactNode {
        return (
            <div
                onContextMenu={(event: React.MouseEvent) => { this.onContext(event) }}
                {...this.getSpecialProps()}
                ref={this.editorRef}>
                {this.renderInformationPanel()}
                {this.renderAvailabelPropertiesPanel()}
                {this.renderCommands()}
                {this.renderNodes()}
                {this.renderLinks()}
            </div>
        );
    }

    private renderInformationPanel(): React.ReactNode {
        const outOfModel = '--None--'
        const assignedModelValue = this.state.modelDescriptor
            ? this.state.modelDescriptor.label
            : outOfModel;

        // TODO: доделать привязку трехмерной модели к блюпринту
        
        return (
            <div className='blueprint-editor__info-panel'>
                <div className='blueprint-editor__blueprint-type' title='Тип блюпринта'>
                    <select value={this.state.type} onChange={this.onBlueprintTypeChange.bind(this)}>
                        {Object.keys(BlueprintType).map((type: string, index: number) => {
                            return <option value={type} key={index}>{type}</option>
                        })}
                    </select>
                </div>
                <div className='blueprint-editor__assigned-model'>
                    <select value={assignedModelValue} onChange={() => {}}>
                        <option value={outOfModel}>{outOfModel}</option>
                    </select>
                </div>
            </div>
        );
    }

    private renderAvailabelPropertiesPanel(): React.ReactNode {
        return (
            <AvailabelPropertiesPanel
                className='availabel-properties-panel_position'
                bluprintInfoProvider={this.props.blueprintsInfoProvider}
            />
        );
    }

    private renderCommands(): React.ReactNode {
        const centeringCommandIcon = this.props.iconProvider.getIconById('centering');

        return (
            <div className='blueprint-editor__command-panel'>
                <div className='blueprint-editor__command' onClick={this.resetEditorOffset.bind(this)}>
                    {React.createElement(centeringCommandIcon, {
                        className: 'blueprint-editor__command_centering'
                    })}
                </div>
            </div>
        );
    }

    private renderNodes(): React.ReactNode {
        const isDraggable = this.state.operation?.type === BlueprintEditorOperationType.DragElement;
        const pipelineIcon = this.props.iconProvider.getIconById('pipeline-point');

        return this.state.nodes.map((node: IBlueprintNode, index: number) => {
            return (
                <BlueprintNode
                    label={node.label}
                    description={node.description}
                    nodeId={node.nodeId}
                    posX={node.posX + this.state.centerOffset.x}
                    posY={node.posY + this.state.centerOffset.y}
                    schema={node.schema}
                    uischema={node.uischema}
                    data={node.data}
                    type={node.type}
                    isDraggable={isDraggable}
                    pipelinePointIcon={React.createElement(pipelineIcon, { className: 'pipeline-icon' })}
                    onOutputPipelinePointClick={this.onOutputPipelinePointClick.bind(this, node.uuid)}
                    {...(this.state.operation?.type === BlueprintEditorOperationType.CreatePipelineLink && {
                        onInputPipelinePointClick: this.onInputPipeLinePointClick.bind(this, node.uuid)
                    })}
                    {...(this.state.operation?.type !== BlueprintEditorOperationType.CreatePipelineLink) && {
                        onNodeMouseDown: (event: React.MouseEvent) => { this.onNodeMouseDown(event, index) }
                    }}
                    onContextMenu={this.onNodeContextMenu.bind(this, node.uuid)}
                    onNodeValuesChange={this.onBlueprintNodeValuesChange.bind(this, node.uuid)}
                    key={index}
                />
            );
        });
    }

    private renderLinks(): React.ReactNode {
        let newLink: React.ReactNode | undefined;
        if (this.state.operation?.type === BlueprintEditorOperationType.CreatePipelineLink) {
            newLink = this.renderLink((this.state.operation as ICreateLinkOperation).link, false);
        }

        return (
            <>
                {newLink}
                {this.state.links.map((link: IBlueprintPipelineLink) => {
                    return this.renderLink(link);
                })}
            </>
        );
    }

    private renderLink(link: IBlueprintPipelineLink, useOffset: boolean = true): React.ReactNode {
        return (
            <BlueprintPipelineLink
                startPointPosX={useOffset ? link.startPointPosX + this.state.centerOffset.x : link.startPointPosX}
                startPointPosY={useOffset ? link.startPointPosY + this.state.centerOffset.y : link.startPointPosY}
                endPointPosX={useOffset ? link.endPointPosX + this.state.centerOffset.x : link.endPointPosX}
                endPointPosY={useOffset ? link.endPointPosY + this.state.centerOffset.y : link.endPointPosY}
                onContext={this.onPipelineContext.bind(this, link.uuid)}
            />
        );
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
                        onClick: (event: React.MouseEvent<HTMLDivElement>) => this.onBlueprintNodePlace(event),
                        className: `${baseProps.className} ${baseProps.className}_place-node`
                    };
                case BlueprintEditorOperationType.DragEditor:
                    return {
                        className: `${baseProps.className} ${baseProps.className}_draggable`,
                        onMouseUp: () => { this.setState({ operation: null }) },
                        onMouseLeave: () => { this.setState({ operation: null }) },
                        onMouseMove: (event: React.MouseEvent) => { this.onMouseMoveWhenDragEditor(event) }
                    };
                case BlueprintEditorOperationType.DragElement:
                    return {
                        className: `${baseProps.className} ${baseProps.className}_draggable`,
                        onMouseUp: () => { this.setState({ operation: null }) },
                        onMouseLeave: () => { this.setState({ operation: null }) },
                        onMouseMove: (event: React.MouseEvent) => { this.onMouseMoveWhenDragNode(event) }
                    };
                case BlueprintEditorOperationType.CreatePipelineLink:
                    return {
                        className: `${baseProps.className} ${baseProps.className}_create-link`,
                        onClick: () => { this.setState({ operation: null }); },
                        onMouseMove: (event: React.MouseEvent) => { this.onMouseMoveWhenCreateLink(event) }
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

    private onBlueprintNodePlace(event: React.MouseEvent<HTMLDivElement>) {
        const placeElementOperation = this.state.operation as IPlaceElementOperation;
        const editorRect = this.editorRef.current?.getBoundingClientRect() as DOMRect;
        this.props.blueprintsInfoProvider.createNodeById(
            this.props.uri,
            placeElementOperation.nodeId,
            event.clientX - editorRect.left - this.state.centerOffset.x,
            event.clientY - editorRect.top - this.state.centerOffset.y
        );

        this.setState({
            operation: null
        });
    }

    private onDrugStart(event: React.MouseEvent) {
        if (event.button === 0) {
            this.setState({
                operation: {
                    type: BlueprintEditorOperationType.DragEditor
                } as IDragEditorOperation
            });
        }
    }

    private onMouseMoveWhenDragEditor(event: React.MouseEvent) {
        const currentoffset = this.state.centerOffset;
        this.setState({
            centerOffset: {
                x: currentoffset.x + event.movementX,
                y: currentoffset.y + event.movementY
            }
        });
    }

    private onNodeMouseDown(event: React.MouseEvent, index: number) {
        event.stopPropagation();
        
        this.setState({
            operation: {
                type: BlueprintEditorOperationType.DragElement,
                nodeIndex: index
            } as IDragNodeOperation
        })
    }

    private onMouseMoveWhenDragNode(event: React.MouseEvent) {
        const operation = this.state.operation as IDragNodeOperation;
        const targetNode = this.state.nodes[operation.nodeIndex];
        this.props.blueprintsInfoProvider.updatedNodePosition(
            this.props.uri,
            targetNode.uuid,
            event.movementX,
            event.movementY
        );
    }

    private onNodeContextMenu(uuid: string, event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.props.dialogService.showContextMenu({
            context: 'blueprints-editor-node-context',
            coords: {
                x: event.clientX,
                y: event.clientY
            },
            handlerArgs: {
                editorUri: this.props.uri,
                nodeUUID: uuid
            } as INodeId
        });
    }

    private resetEditorOffset() {
        this.setState({
            centerOffset: {
                x: 0,
                y: 0
            }
        });
    }

    private onPipelineContext(uuid: string, event: React.MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        this.props.dialogService.showContextMenu({
            context: 'blueprints-editor-link-context',
            coords: {
                x: event.clientX,
                y: event.clientY
            },
            handlerArgs: {
                editorUri: this.props.uri,
                linkUUID: uuid
            } as ILinkInfo
        })
    }

    private onOutputPipelinePointClick(startNodeUUID: string, posX: number, posY: number) {
        if (this.state.operation?.type === BlueprintEditorOperationType.CreatePipelineLink) {
            return;
        }
        const editorRect = this.editorRef.current?.getBoundingClientRect() as DOMRect;
        
        this.setState({
            operation: {
                type: BlueprintEditorOperationType.CreatePipelineLink,
                link: createPipelineLink(posX - editorRect.left, posY - editorRect.top, startNodeUUID)
            } as ICreateLinkOperation
        });
    }

    private onInputPipeLinePointClick(endNodeUUID: string, posX: number, posY: number) {
        if (this.state.operation?.type === BlueprintEditorOperationType.CreatePipelineLink) {
            const createdLink = (this.state.operation as ICreateLinkOperation).link;
            this.setState({
                operation: null,
            }, () => {
                const rect = this.editorRef.current?.getBoundingClientRect() as DOMRect;
                this.props.blueprintsInfoProvider.createLink(
                    this.props.uri, {
                        ...createdLink,
                        rightNodeUUID: endNodeUUID,
                        startPointPosX: createdLink.startPointPosX - this.state.centerOffset.x,
                        startPointPosY: createdLink.startPointPosY - this.state.centerOffset.y,
                        endPointPosX: posX - rect.left - this.state.centerOffset.x,
                        endPointPosY: posY - rect.top - this.state.centerOffset.y
                });
            });
        }
    }

    private onMouseMoveWhenCreateLink(event: React.MouseEvent) {
        const link = (this.state.operation as ICreateLinkOperation).link;
        const editorRect = this.editorRef.current?.getBoundingClientRect() as DOMRect;
        
        this.setState({
            operation: {
                ...this.state.operation,
                link: {
                    ...link,
                    endPointPosX: event.clientX - editorRect.left,
                    endPointPosY: event.clientY - editorRect.top
                }
            } as ICreateLinkOperation
        });
    }

    private onBlueprintTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.blueprintsInfoProvider.changeBlueprintType(
            this.props.uri,
            BlueprintType[event.target.value as keyof typeof BlueprintType]
        );
    }

    private onBlueprintNodeValuesChange(uuid: string, state: Pick<JsonFormsCore, 'data' | 'errors'>) {
        this.debouncer.execute(() => {
            this.props.blueprintsInfoProvider.updateNodeData(this.props.uri, uuid, state.data);
        }, 300);
    }
}

@injectable()
export class BlueprintEditorProvider implements IEditorRendererProvider {
    private dialogService: IDialogService;
    private blueprintsInfoProvider: IBlueprintsInfoProvider;
    private iconsProvider: IIconsProvider;

    constructor(
        @inject(CORE_TYPES.IDialogService) dialogService: IDialogService,
        @inject(BLUEPRINT_EDITOR_MODULE.IBlueprintsInfoProvider) blueprintsInfoProvider: IBlueprintsInfoProvider,
        @inject(CORE_TYPES.IIconsProvider) iconsProvider: IIconsProvider
    ) {
        this.dialogService = dialogService;
        this.blueprintsInfoProvider = blueprintsInfoProvider;
        this.iconsProvider = iconsProvider;
    }

    public getRenderer(props: IAbstratcEditorProps): React.ReactElement {
        return (
            <BlueprintEditor
                uri={props.uri}
                blueprintsInfoProvider={this.blueprintsInfoProvider}
                dialogService={this.dialogService}
                iconProvider={this.iconsProvider}
            />
        );
    }

    public getEditorType(): ResourceType {
        return ResourceType.Blueprint;
    }
}

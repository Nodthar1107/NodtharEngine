import * as React from 'react';
import { inject, injectable } from 'inversify';
import { AbstractEditor, IAbstratcEditorProps } from '../editor-viewer/EditorRenderers/AbstractEditor';
import { ResourceType } from '../files-explorer/ResourcesManager/ResourceType';
import { IEditorRendererProvider } from '../editor-viewer/EditorRenderers/EditorRendererProvider';
import { IDialogService } from '../core/services/DialogService/IDialogService';
import { BlueprintsListView, IBlueprintsListViewProps } from './BlueprintsListView';
import { CORE_TYPES } from '../core/module-types';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';
import { BLUEPRINT_EDITOR_MODULE } from './module-types';
import { ICustomDialogBaseProps } from '../core/services/DialogService/DialogServiceRenderer';
import { BlueprintEditorOperationType, IBlueprintNode, ICreateLinkOperation, IDragEditorOperation, IDragNodeOperation, IEditorOperation, IPlaceElementOperation } from './model';
import { BlueprintNode } from './BluprintNode';
import { ICommandRegister } from '../core/providers/commandsProvider/ICommandRegister';
import { ISubscriber } from '../core/utils/events/ISubscriber';
import { BlueprintEditorEvents } from './events';
import { NotificationEvent } from 'src/core/utils/events/NotificationEvent';
import { INodeId } from './BlueprintsEditorCommandsContribution';

import './style.scss';
import { IIconsProvider } from 'src/core/providers/IIconsProvider';
import { createPipelineLink } from './utils';

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
    nodes: IBlueprintNode[];
    centerOffset: ICoords;
}

export class BlueprintEditor
    extends AbstractEditor<IBlueprintEditorProps, IBlueprintEditorState>
    implements ISubscriber<BlueprintEditorEvents>
{
    constructor(props: IBlueprintEditorProps) {
        super(props);

        const blueprintDescriptor = this.props.blueprintsInfoProvider.getBlueprintsDataByUri(props.uri);
        this.state = {
            previousUri: this.props.uri,
            operation: null,
            nodes: blueprintDescriptor.nodes,
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
                nodes: blueprintDescriptor.nodes,
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
                nodes: blueprintDescriptor.nodes
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
                {...this.getSpecialProps()}>
                {this.renderCommands()}
                {this.renderNodes()}
            </div>
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
                    uuid={node.uuid}
                    posX={node.posX + this.state.centerOffset.x}
                    posY={node.posY + this.state.centerOffset.y}
                    schema={node.schema}
                    type={node.type}
                    isDraggable={isDraggable}
                    pipelinePointIcon={React.createElement(pipelineIcon, { className: 'pipeline-icon' })}
                    onOutputPipelinePointClick={this.onOutputPipelinePointClick.bind(this)}
                    onNodeMouseDown={(event: React.MouseEvent) => { this.onNodeMouseDown(event, index) }}
                    onContextMenu={this.onNodeContextMenu.bind(this)}
                    key={index}
                />
            );
        });
    }

    private renderLinks(): React.ReactNode {
        return <></>;
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
                        onMouseMove: (event: React.MouseEvent) => { this.onMouseMove(event) }
                    };
                case BlueprintEditorOperationType.DragElement:
                    return {
                        className: `${baseProps.className} ${baseProps.className}_draggable`,
                        onMouseUp: () => { this.setState({ operation: null }) },
                        onMouseLeave: () => { this.setState({ operation: null }) },
                        onMouseMove: (event: React.MouseEvent) => { this.onNodeDrag(event) }
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
        const editorRect = event.currentTarget.getBoundingClientRect() as DOMRect;
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

    private onMouseMove(event: React.MouseEvent) {
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

    private onNodeDrag(event: React.MouseEvent) {
        const operation = this.state.operation as IDragNodeOperation;
        const targetNode = this.state.nodes[operation.nodeIndex];
        this.props.blueprintsInfoProvider.updatedNodePosition(
            this.props.uri,
            targetNode.uuid,
            targetNode.posX + event.movementX,
            targetNode.posY + event.movementY
        );
    }

    private onNodeContextMenu(event: React.MouseEvent, uuid: string) {
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

    private onOutputPipelinePointClick(nodeUUID: string, posX: number, posY: number) {
        this.setState({
            operation: {
                type: BlueprintEditorOperationType.CreatePipelineLink,
                link: createPipelineLink(posX, posY, nodeUUID)
            } as ICreateLinkOperation
        });
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

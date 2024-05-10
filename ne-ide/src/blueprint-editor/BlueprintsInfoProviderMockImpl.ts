import { inject, injectable } from 'inversify';
import { Guid } from 'guid-typescript';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';
import { BlueprintNodeType, IBlueprintBlockDescriptor, IBlueprintDescriptor, IBlueprintNode, IBlueprintPipelineLink } from './model';
import { EventEmitter } from '../core/utils/events/EventEmitter';
import { BlueprintEditorEvents } from './events';
import { IEventEmitter } from '../core/utils/events/IEventEmitter';
import { NotificationEvent } from '../core/utils/events/NotificationEvent';
import { IMessageService } from '../core/services/MessageService/MessageService';
import { CORE_TYPES } from '../core/module-types';

import 'reflect-metadata';

@injectable()
export class BlueprintsInfoProviderMockImpl implements IBlueprintsInfoProvider {
    private blueprintsLibrary: IBlueprintBlockDescriptor[] = [];
    private editorsDataCache: Map<string, IBlueprintDescriptor> = new Map(); 
    private nodesMapper: Map<string, IBlueprintNode> = new Map();

    private eventEmitter = new EventEmitter<BlueprintEditorEvents>();

    private messageService: IMessageService;

    constructor(
        @inject(CORE_TYPES.IMessageService) messageService: IMessageService
    ) {
        this.messageService = messageService;

        this.configureLibrary();
        this.configureNodesMap();
    }

    public getEventEmitter(): IEventEmitter<BlueprintEditorEvents> {
        return this.eventEmitter;
    }

    public getBlueprintsLibrary(): IBlueprintBlockDescriptor[] {
        return this.blueprintsLibrary;
    }

    public getBlueprintsDataByUri(uri: string): IBlueprintDescriptor {
        if (!this.editorsDataCache.has(uri)) {
            this.editorsDataCache.set(
                uri, {
                    links: [],
                    nodes: []
                });
        }

        return this.editorsDataCache.get(uri) as IBlueprintDescriptor;
    }

    public createNodeById(uri: string, id: string, posX: number, posY: number) {
        const blueprint = this.editorsDataCache.get(uri);
        if (!blueprint) {
            return;
        }

        blueprint.nodes.push({
            ...this.nodesMapper.get(id) as IBlueprintNode,
            uuid: Guid.create().toString(),
            posX: posX,
            posY: posY
        });

        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
    }

    public updatedNodePosition(uri: string, uuid: string, movementX: number, movementY: number) {
        if (!this.editorsDataCache.has(uri)) {
            return;
        }

        const editor = (this.editorsDataCache.get(uri) as IBlueprintDescriptor);
        const updatedNodes = editor.nodes.slice(); 
        let nodeIndex = -1;
        const target = updatedNodes.find((node: IBlueprintNode, index: number) => {
            nodeIndex = index;

            return node.uuid === uuid;
        }) as IBlueprintNode;

        updatedNodes[nodeIndex] = {
            ...target,
            posX: target.posX + movementX,
            posY: target.posY + movementY,
        } as IBlueprintNode;

        this.editorsDataCache.set(uri, {
            ...editor,
            nodes: updatedNodes,
            links: this.getUpdatedLinks(
                target?.uuid as string,
                editor.links,
                movementX,
                movementY
            )
        });
        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
    }

    public removeNode(uri: string, uuid: string) {
        const editor = this.editorsDataCache.get(uri);
        if (!editor) {
            return;
        }

        this.editorsDataCache.set(
            uri, {
            ...editor,
            nodes: editor.nodes.slice().filter((node: IBlueprintNode) => {
                return node.uuid !== uuid;
            }),
            links: editor.links.slice().filter((link: IBlueprintPipelineLink) => {
                return link.leftNodeUUID !== uuid && link.rightNodeUUID !== uuid;
            })
        });

        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
    }

    public moveNodeToFront(uri: string, uuid: string) {
        this.changeNodeOrder(uri, uuid);
    }

    public moveNodeToBack(uri: string, uuid: string) {
        this.changeNodeOrder(uri, uuid, false);
    }

    public createLink(uri: string, pipelineLink: IBlueprintPipelineLink) {
        const editor = this.editorsDataCache.get(uri);
        if (!editor) {
            return;
        }

        if (pipelineLink.leftNodeUUID === pipelineLink.rightNodeUUID) {
            this.messageService.showErrorMessage({
                title: 'Ошибка пайплайна',
                description: 'Связь не может соединять входной и выходной узлы одного и того же блока'
            });
            
            return;
        } 

        const updatedLinks = editor.links.slice();
        updatedLinks.push(pipelineLink);

        this.editorsDataCache.set(uri, {
            ...editor,
            links: updatedLinks
        });

        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
    }

    public removeLink(uri: string, uuid: string) {
        const editor = this.editorsDataCache.get(uri);
        if (!editor) {
            return;
        }

        this.editorsDataCache.set(uri, {
            ...editor,
            links: editor.links.slice().filter((link: IBlueprintPipelineLink) => {
                return link.uuid !== uuid;
            })
        });

        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
    }

    private changeNodeOrder(uri: string, uuid: string, toFront: boolean = true) {
        const editor = this.editorsDataCache.get(uri); 
        if (!editor) {
            return;
        }

        let targetNode: IBlueprintNode | undefined;
        const updatedNodes = editor.nodes.slice()
            .filter((node: IBlueprintNode) => {
                if (node.uuid === uuid) {
                    targetNode = node;

                    return false;
                }

                return true;
            }
        );

        toFront ? updatedNodes.push(targetNode as IBlueprintNode) : updatedNodes.unshift(targetNode as IBlueprintNode);
        this.editorsDataCache.set(
            uri, {
                ...editor,
                nodes: updatedNodes
        });

        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
    }

    private getUpdatedLinks(
        nodeUUID: string,
        links: IBlueprintPipelineLink[],
        movementX: number,
        movementY: number
    ): IBlueprintPipelineLink[] {
        return links.slice().map((link: IBlueprintPipelineLink) => {
            if (link.leftNodeUUID === nodeUUID) {
                return {
                    ...link,
                    startPointPosX: link.startPointPosX + movementX,
                    startPointPosY: link.startPointPosY + movementY
                }
            }

            if (link.rightNodeUUID === nodeUUID) {
                return {
                    ...link,
                    endPointPosX: link.endPointPosX + movementX,
                    endPointPosY: link.endPointPosY + movementY
                }
            }
            return link;
        })
    }

    private configureLibrary() {
        this.blueprintsLibrary = [
            {
                label: 'PrintString',
                description: 'Выводит строку в поток печати',
                group: 'Commons',
                nodeId: 'print-string',
            },
            {
                label: 'SetRelativeCoordinates',
                description: 'Устанавливает относительное значение координатного вектора',
                group: 'Actor',
                nodeId: 'set-relative-coordinates'
            },
            {
                label: 'SetAbsoluteCoordinates',
                description: 'Устанавливает относительное значение координатного вектора',
                group: 'Actor',
                nodeId: 'set-absolute-coordinates'
            },
            {
                label: 'SetRelativeRotation',
                description: 'Устанавливает относительное значение вектора вращения',
                group: 'Actor',
                nodeId: 'set-relative-rotation'
            },
            {
                label: 'SetAbsoluteRotation',
                description: 'Устанавливает абсолютное значение вектора вращения',
                group: 'Actor',
                nodeId: 'set-absolute-rotation'
            },
            {
                label: 'Tick',
                group: 'Events',
                description: 'Событие, срабатывающее каждый кадр',
                nodeId: 'events:tick'
            }
        ]
    }

    private configureNodesMap() {
        this.nodesMapper = new Map([
            ['events:tick', this.createNode('Tick', 'events:tick', BlueprintNodeType.Event)],
            ['print-string', this.createNode('PrintString', 'print-string', BlueprintNodeType.FunctionalNode)],
            ['set-absolute-coordinates', this.createNode('SetAbsolueCoordinates', 'set-absolute-coordinates', BlueprintNodeType.TransformationNode)]
        ]);
    }

    private createNode(label: string, nodeId: string, type: BlueprintNodeType): IBlueprintNode {
        return {
            label: label,
            nodeId: nodeId,
            uuid: '',
            description: 'Some description',
            posX: 0,
            posY: 0,
            schema: '{"type": "object", "properties": { "InputString": { "type": "string" }}}',
            data: '',
            uischema: '{"type": "VerticalLayout", "elements": [{ "type": "StringControl", "scope": "#/properties/InputString" }]}',
            type: type
        }
    }
}

import { injectable } from 'inversify';
import { Guid } from 'guid-typescript';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';
import { BlueprintNodeType, IBlueprintDescriptor, IBlueprintNode } from './model';
import { EventEmitter } from '../core/utils/events/EventEmitter';
import { BlueprintEditorEvents } from './events';
import { IEventEmitter } from '../core/utils/events/IEventEmitter';
import { NotificationEvent } from '../core/utils/events/NotificationEvent';

import 'reflect-metadata';

@injectable()
export class BlueprintsInfoProviderMockImpl implements IBlueprintsInfoProvider {
    private blueprintsLibrary: IBlueprintDescriptor[] = [];
    private editorsDataCache: Map<string, IBlueprintNode[]> = new Map(); 
    private nodesMapper: Map<string, IBlueprintNode> = new Map();

    private eventEmitter = new EventEmitter<BlueprintEditorEvents>();

    constructor() {
        this.configureLibrary();
        this.configureNodesMap();
    }

    public getEventEmitter(): IEventEmitter<BlueprintEditorEvents> {
        return this.eventEmitter;
    }

    public getBlueprintsLibrary(): IBlueprintDescriptor[] {
        return this.blueprintsLibrary;
    }

    public getBlueprintsNodesByUri(uri: string): IBlueprintNode[] {
        if (!this.editorsDataCache.has(uri)) {
            this.editorsDataCache.set(uri, []);
        }

        return this.editorsDataCache.get(uri) as IBlueprintNode[];
    }

    public createNodeById(uri: string, id: string, posX: number, posY: number) {
        const nodes = this.editorsDataCache.get(uri);
        if (!nodes) {
            return;
        }

        nodes.push({
            ...this.nodesMapper.get(id) as IBlueprintNode,
            uuid: Guid.create().toString(),
            posX: posX,
            posY: posY
        });

        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
    }

    public updatedNodePosition(uri: string, uuid: string, posX: number, posY: number) {
        if (!this.editorsDataCache.has(uri)) {
            return;
        }

        const updatedNodes = (this.editorsDataCache.get(uri) as IBlueprintNode[]).slice();
        let nodeIndex = -1;
        const target = updatedNodes.find((node: IBlueprintNode, index: number) => {
            nodeIndex = index;

            return node.uuid === uuid;
        });

        updatedNodes[nodeIndex] = {
            ...target,
            posX: posX,
            posY: posY
        } as IBlueprintNode;

        this.editorsDataCache.set(uri, updatedNodes);
        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
    }

    public removeNode(uri: string, uuid: string) {
        const nodes = this.editorsDataCache.get(uri);
        if (!nodes) {
            return;
        }

        this.editorsDataCache.set(
            uri,
            nodes.filter((node: IBlueprintNode) => {
                return node.uuid !== uuid;
            })
        );

        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
    }

    public moveNodeToFront(uri: string, uuid: string) {
        this.changeNodeOrder(uri, uuid);
    }

    public moveNodeToBack(uri: string, uuid: string) {
        this.changeNodeOrder(uri, uuid, false);
    }

    private changeNodeOrder(uri: string, uuid: string, toFront: boolean = true) {
        if (!this.editorsDataCache.has(uri)) {
            return;
        }

        let targetNode: IBlueprintNode | undefined;
        const updatedNodes = (this.editorsDataCache.get(uri) as IBlueprintNode[]).slice()
            .filter((node: IBlueprintNode) => {
                if (node.uuid === uuid) {
                    targetNode = node;

                    return false;
                }

                return true;
            }
        );

        toFront ? updatedNodes.push(targetNode as IBlueprintNode) : updatedNodes.unshift(targetNode as IBlueprintNode);
        this.editorsDataCache.set(uri, updatedNodes);

        this.eventEmitter.fireEvent(new NotificationEvent<BlueprintEditorEvents>(BlueprintEditorEvents.BluprintUpdated));
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
                nodeId: 'set-relative-coordinates'
            },
            {
                label: 'SetRelativeRotation',
                description: 'Устанавливает относительное значение вектора вращения',
                group: 'Actor',
                nodeId: 'set-relative-coordinates'
            },
            {
                label: 'SetAbsoluteRotation',
                description: 'Устанавливает абсолютное значение вектора вращения',
                group: 'Actor',
                nodeId: 'set-absolute-coordinates'
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
            ['print-string', this.createNode('PrintString', 'print-string', BlueprintNodeType.FunctionalNode)]
        ]);
    }

    private createNode(label: string, nodeId: string, type: BlueprintNodeType): IBlueprintNode {
        return {
            label: label,
            nodeId: nodeId,
            uuid: '',
            description: '',
            posX: 0,
            posY: 0,
            schema: '',
            type: type
        }
    }
}
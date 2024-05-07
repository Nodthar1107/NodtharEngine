import { injectable } from 'inversify';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';
import { BlueprintNodeType, IBlueprintDescriptor, IBlueprintNode } from './model';
import { URI } from '../core/utils/URI';

import 'reflect-metadata';

@injectable()
export class BlueprintsInfoProviderMockImpl implements IBlueprintsInfoProvider {
    private blueprintsLibrary: IBlueprintDescriptor[] = [];
    private nodesMapper: Map<string, IBlueprintNode> = new Map();

    constructor() {
        this.configureLibrary();
        this.configureNodesMap();
    }

    public getBlueprintsLibrary(): IBlueprintDescriptor[] {
        return this.blueprintsLibrary;
    }

    public getBlueprintsNodes(uri: string): IBlueprintNode[] {
        return [];
    }

    public createNodeById(id: string): IBlueprintNode {
        return { ...this.nodesMapper.get(id) as IBlueprintNode };
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
            description: '',
            posX: 0,
            posY: 0,
            schema: '',
            type: type
        }
    }
}
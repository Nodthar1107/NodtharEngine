import { inject, injectable } from 'inversify';
import { ICommandContribution } from '../core/providers/commandsProvider/ICommandContribution';
import { ICommandRegister } from '../core/providers/commandsProvider/ICommandRegister';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';
import { BLUEPRINT_EDITOR_MODULE } from './module-types';

export interface INodeId {
    editorUri: string;
    nodeUUID: string;
}

@injectable()
export class BlueprintsEditorCommandsContribution implements ICommandContribution {
    private blueprintsInfoProvider: IBlueprintsInfoProvider;

    constructor(
        @inject(BLUEPRINT_EDITOR_MODULE.IBlueprintsInfoProvider) blueprintsInfoProvider: IBlueprintsInfoProvider
    ) {
        this.blueprintsInfoProvider = blueprintsInfoProvider;
    }

    public registerCommands(register: ICommandRegister) {
        this.registerNodeContextCommands(register);
    }

    private registerNodeContextCommands(register: ICommandRegister) {
        register.registerCommand({
            context: 'blueprints-editor-node-context',
            id: 'blueprintsEditor.node.moveToFront',
            title: 'Переместить на передний план',
            execute: (nodeInfo: INodeId) => {
                this.blueprintsInfoProvider.moveNodeToFront(nodeInfo.editorUri, nodeInfo.nodeUUID);
            }
        });

        register.registerCommand({
            context: 'blueprints-editor-node-context',
            id: 'blueprintsEditor.node.moveToBack',
            title: 'Переместить на задний план',
            execute: (nodeInfo: INodeId) => {
                this.blueprintsInfoProvider.moveNodeToBack(nodeInfo.editorUri, nodeInfo.nodeUUID);
            }
        });
        
        register.registerCommand({
            context: 'blueprints-editor-node-context',
            id: 'blueprintsEditor.node.rename',
            title: 'Переименовать'
        });

        register.registerCommand({
            context: 'blueprints-editor-node-context',
            id: 'blueprintsEditor.node.remove',
            title: 'Удалить',
            execute: (nodeInfo: INodeId) => {
                this.blueprintsInfoProvider.removeNode(nodeInfo.editorUri, nodeInfo.nodeUUID);
            }
        });
    }
}
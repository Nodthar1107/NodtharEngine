import { injectable } from 'inversify';
import { ICommandContribution } from '../core/providers/commandsProvider/ICommandContribution';
import { ICommandRegister } from '../core/providers/commandsProvider/ICommandRegister';

import 'reflect-metadata';

@injectable()
export class FilesExplorerCommandsContribution implements ICommandContribution {
    public registerCommands(register: ICommandRegister) {
        register.registerCommand({
            id: 'filesExplorer.openDialog.createNewResource',
            context: 'files-explorer-context',
            title: 'Добавить ресурс',
            iconId: 'add',
            execute: () => {
                alert('Hello world')

                // TODO
                return undefined;
            }
        })
    }

}
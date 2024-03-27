import { ICommand } from './commands';

export interface ICommandsProvider {
    executeCommand: (commandId: string, ...args: any[]) => Promise<any>;

    getCommandsByContext: (context: string) => ICommand[];
}

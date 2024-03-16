import { ICommandDescriptor } from './ICommandDescriptor';

export interface ICommandsProvider {
    getCommandsByContext: (context: string) => ICommandDescriptor[];
}
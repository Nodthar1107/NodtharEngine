import { ICommandDescriptor } from './commands';

export interface ICommandRegister {
    registerCommand: (command: ICommandDescriptor) => void;
}

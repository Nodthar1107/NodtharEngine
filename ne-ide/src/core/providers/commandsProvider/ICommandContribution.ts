import { ICommandDescriptor } from './commands';
import { ICommandRegister } from './ICommandRegister';

export interface ICommandContribution {
    registerCommands: (register: ICommandRegister) => void;
}
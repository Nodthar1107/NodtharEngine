import { ICommandDto } from "./ICommandDto";

export interface ICommandDescriptor extends Omit<ICommandDto, 'iconId'> {
    /** Path to icon */
    icon?: React.FC;
}
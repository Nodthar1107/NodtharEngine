import * as React from 'react';
import { ICommandDto } from './ICommandDto';

export interface ICommandDescriptor extends ICommandDto {
    execute?: (...args: any) => Promise<unknown> | void;
}

export interface ICommand extends Omit<ICommandDescriptor, 'iconId'> {
    iconComponent?: React.FC;
}

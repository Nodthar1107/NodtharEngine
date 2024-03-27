import * as React from 'react';
import { ICommandDto } from './ICommandDto';

export interface ICommandDescriptor extends ICommandDto {
    execute?: () => Promise<unknown> | undefined;
}

export interface ICommand extends Omit<ICommandDescriptor, 'iconId'> {
    iconComponent?: React.FC;
}

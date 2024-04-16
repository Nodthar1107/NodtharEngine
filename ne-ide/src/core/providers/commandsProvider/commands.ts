import * as React from 'react';
import { ICommandDto } from './ICommandDto';
import { IIconProps } from 'src/core/icons/IIconProps';

export interface ICommandDescriptor extends ICommandDto {
    isEnable?: () => void;
    execute?: (...args: any) => Promise<unknown> | void;
}

export interface ICommand extends Omit<ICommandDescriptor, 'iconId'> {
    iconComponent?: React.FC<IIconProps>;
}

import * as React from 'react';
import { IIconProps } from '../icons/IIconProps';

export interface IIconsProvider {
    getIconById: (iconId: string) => React.FC<IIconProps>;
}
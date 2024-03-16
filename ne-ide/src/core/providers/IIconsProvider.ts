import * as React from 'react';
import { IIconProps } from '../icons/IIconProps';

export interface IIconsProvider {
    getIconById: (iconId: string | undefined) => React.FC<IIconProps>;
}
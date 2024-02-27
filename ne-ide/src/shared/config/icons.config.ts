import * as React from 'react';
import { MoveObject } from '../icons/ActivityBarPanel/MoveObject';
import { IIconProps } from '../icons/IIconProps';

export const ICONS_MAP: Map<string, React.FC<IIconProps>> = new Map([
    ['move-object', MoveObject]
]);
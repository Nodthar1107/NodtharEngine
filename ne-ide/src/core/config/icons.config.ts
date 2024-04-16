import * as React from 'react';
import { MoveObject } from '../icons/ActivityBarPanel/MoveObject';
import { IIconProps } from '../icons/IIconProps';
import { Scene } from '../icons/hierarchy/Scene';
import { Box } from '../icons/hierarchy/Box';
import { Sphere } from '../icons/hierarchy/Sphere';
import { Collapse, Expand } from '../icons';
import { Folder } from '../icons/hierarchy/Folder';
import { Add } from '../icons/Commons/Add';
import { Back } from '../icons/Commons/Back';

export const ICONS_MAP: Map<string, React.FC<IIconProps>> = new Map([
    ['move-object', MoveObject],
    ['scene', Scene],
    ['box', Box],
    ['sphere', Sphere],
    ['collapse', Collapse],
    ['expand', Expand],
    ['Folder', Folder],
    ['add', Add],
    ['back', Back]
]);
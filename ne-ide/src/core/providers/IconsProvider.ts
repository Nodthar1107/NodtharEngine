import * as React from 'react';
import { injectable } from 'inversify';

import { ICONS_MAP } from '../config/icons.config';
import { IIconProps } from '../icons/IIconProps';
import { IIconsProvider } from './IIconsProvider';
import { NotFoundIcon } from '../icons/Commons/NotFoundIcon';

import 'reflect-metadata';

@injectable()
export class IconsProvider implements IIconsProvider {
    public getIconById(iconId: string | undefined): React.FC<IIconProps> {
        if (!iconId) {
            return NotFoundIcon;
        }
        
        return ICONS_MAP.get(iconId) || NotFoundIcon;
    }
}

export const iconsProvider = new IconsProvider(); 

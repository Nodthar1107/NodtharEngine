import * as React from 'react';
import { ICONS_MAP } from '../config/icons.config';
import { IIconProps } from '../icons/IIconProps';
import { IIconsProvider } from './IIconsProvider';
import { NotFoundIcon } from '../icons/NotFoundIcon';
import { injectable } from 'inversify';

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

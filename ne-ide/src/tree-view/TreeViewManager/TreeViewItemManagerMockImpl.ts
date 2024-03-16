import { Box } from '../../core/icons/hierarchy/Box';
import { IHierarchyItem } from '../items/IHierarchyItem';
import { ITreeViewManager } from './ITreeViewManager';
import { Scene } from '../../core/icons/hierarchy/Scene';
import { Sphere } from '../../core/icons/hierarchy/Sphere';
import { injectable } from 'inversify';

import 'reflect-metadata';

@injectable()
export class TreeViewManagerMockImpl implements ITreeViewManager {
    public getSceneHierarchy(sceneId: string): IHierarchyItem {
        return {
            label: 'scene',
            id: 'scene',
            uri: '',
            icon: Scene,
            children: [
                {
                    label: 'box',
                    id: 'box',
                    uri: '',
                    icon: Box,
                    children: [
                        {
                            label: 'super-mega-long-name',
                            id: 'box-1',
                            uri: '',
                            icon: Box,
                        }
                    ]
                },
                {
                    label: 'sphere',
                    id: 'sphere',
                    uri: '',
                    icon: Sphere,
                }
            ],
        };
    }
}
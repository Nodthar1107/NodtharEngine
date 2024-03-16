import { Container } from 'inversify';
import { IDIModule } from 'src/core/dependencies/IDIModule';
import { TreeViewManagerMockImpl } from './TreeViewManager/TreeViewItemManagerMockImpl';
import { ITreeViewManager } from './TreeViewManager/ITreeViewManager';
import { TREE_VIEW_MODULE } from './module-types';

export class TreeViewModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind(TREE_VIEW_MODULE.ITreeViewManager)
            .to(TreeViewManagerMockImpl);
    }
}
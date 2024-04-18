import { injectable } from 'inversify';
import { IContextMenuDialogDetails } from './DialogServiceRenderer';
import { IDialogService, IDialogServiceRenderer } from './IDialogService';
import { IDialogRendererRegister } from './ISubscribeRegister';

import 'reflect-metadata';

@injectable()
export class DialogService implements IDialogService, IDialogRendererRegister {
    private renderer: IDialogServiceRenderer | null = null;

    public registerDialogRenderer(renderer: IDialogServiceRenderer) {
        this.renderer = renderer;
    }

    public showContextMenu(details: IContextMenuDialogDetails): void {
        if (this.renderer !== null) {
            this.renderer.showContextMenu(details);
        }
    }
}
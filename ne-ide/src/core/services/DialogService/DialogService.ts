import { injectable } from 'inversify';
import { IContextMenuDialogDetails, IInputDialogDetails } from './DialogServiceRenderer';
import { IDialogService, IDialogServiceRenderer, IInputDialogOptions } from './IDialogService';
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

    public showInputDialog(options: IInputDialogOptions): Promise<string> {
        return new Promise((resolve) => {
            if (this.renderer !== null) {
                this.renderer.showInputDialog({
                    ...options,
                    resolve: resolve
                });
            }
        });
    }
}
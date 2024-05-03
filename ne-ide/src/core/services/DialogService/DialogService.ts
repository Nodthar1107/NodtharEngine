import { injectable } from 'inversify';
import { IContextMenuDialogDetails, IInputDialogDetails } from './DialogServiceRenderer';
import { IDialogService, IDialogServiceRenderer, IInputDialogOptions, IQuickInputDialogOptions } from './IDialogService';
import { IDialogRendererRegister } from './ISubscribeRegister';

import 'reflect-metadata';
import { IQuickInputItem } from './QuickInputDialog';

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

    public showQuickInputDialog(options: IQuickInputDialogOptions): Promise<IQuickInputItem> {
        return new Promise((resolve) => {
            if (this.renderer !== null) {
                this.renderer.showQuickInputDialog({
                    ...options,
                    resolve: resolve
                })
            }
        });
    }
}
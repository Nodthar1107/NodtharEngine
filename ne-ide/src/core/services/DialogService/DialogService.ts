import * as React from 'react';
import { injectable } from 'inversify';
import { IContextMenuDialogDetails, ICustomDialogBaseProps } from './DialogServiceRenderer';
import { IDialogService, IDialogServiceRenderer, IInputDialogOptions, IQuickInputDialogOptions } from './IDialogService';
import { IDialogRendererRegister } from './ISubscribeRegister';
import { IQuickInputItem } from './QuickInputDialog';
import { IUploadedFileDescriptor } from './UploadFileDialog';

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

    public showUploadFilesDialog(): Promise<IUploadedFileDescriptor[] | undefined> {
        return new Promise((resolve) => {
            if (this.renderer !== null) {
                this.renderer.showUploadFilesDialog({
                    resolve: resolve
                });
            }
        })
    }

    public showCustomDialog(
        dialogComponent: React.ComponentType<ICustomDialogBaseProps>,
        event: React.MouseEvent<Element, MouseEvent>,
        props?: any
    ) {
        if (this.renderer !== null) {
            this.renderer.showCustomDialog({
                component: dialogComponent,
                coords: {
                    x: event.clientX,
                    y: event.clientY,
                },
                props: props
            });
        }
    }
}
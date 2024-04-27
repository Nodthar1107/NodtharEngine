import { IContextMenuDialogDetails, IInputDialogDetails } from './DialogServiceRenderer';

export interface IDialogOptions {
    title?: string;
    description?: string;
}

export interface IInputDialogOptions extends IDialogOptions { }

export interface IDialogServiceRenderer {
    showContextMenu: (options: IContextMenuDialogDetails) => void;
    showInputDialog: (options: IInputDialogDetails) => void;
}

export interface IDialogService {
    showContextMenu: (options: IContextMenuDialogDetails) => void;
    showInputDialog: (options: IInputDialogOptions) => Promise<string>;
}
import { IContextMenuDialogDetails, IInputDialogDetails } from './DialogServiceRenderer';

export interface IDialogServiceRenderer {
    showContextMenu: (options: IContextMenuDialogDetails) => void;
    showInputDialog: (options: IInputDialogDetails) => Promise<string>;
}

export interface IDialogService extends IDialogServiceRenderer {}
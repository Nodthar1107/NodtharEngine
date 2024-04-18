import { IContextMenuDialogDetails } from './DialogServiceRenderer';

export interface IDialogServiceRenderer {
    showContextMenu: (options: IContextMenuDialogDetails) => void;    
}

export interface IDialogService extends IDialogServiceRenderer {}
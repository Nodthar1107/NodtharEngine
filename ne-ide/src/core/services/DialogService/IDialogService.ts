import { IContextMenuDialogDetails, IInputDialogDetails, IQuickInputDialogDetails } from './DialogServiceRenderer';
import { IQuickInputItem } from './QuickInputDialog';

export interface IDialogOptions {
    title?: string;
    description?: string;
}

export interface IInputDialogOptions extends IDialogOptions { }

export interface IQuickInputDialogOptions extends IDialogOptions {
    items: IQuickInputItem[];
    hideInput?: boolean;
}

export interface IDialogServiceRenderer {
    showContextMenu: (options: IContextMenuDialogDetails) => void;
    showInputDialog: (options: IInputDialogDetails) => void;
    showQuickInputDialog: (options: IQuickInputDialogDetails) => void;
}

export interface IDialogService {
    showContextMenu: (options: IContextMenuDialogDetails) => void;
    showInputDialog: (options: IInputDialogOptions) => Promise<string | undefined>;
    showQuickInputDialog: (options: IQuickInputDialogOptions) => Promise<IQuickInputItem | undefined>;
}
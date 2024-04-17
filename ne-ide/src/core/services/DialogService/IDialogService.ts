import { IContextMenuDialogDetails } from './DialogService';

export interface IDialogService {
    showContextMenu: (options: IContextMenuDialogDetails) => void;    
}
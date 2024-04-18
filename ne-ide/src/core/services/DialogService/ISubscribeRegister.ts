import { IDialogServiceRenderer } from './IDialogService';

export interface IDialogRendererRegister {
    registerDialogRenderer: (renderer: IDialogServiceRenderer) => void;
}
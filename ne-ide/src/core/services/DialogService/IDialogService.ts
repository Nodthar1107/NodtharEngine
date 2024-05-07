import * as React from 'react';

import { IContextMenuDialogDetails, ICustomDialogBaseProps, ICustomDialogDetails, IInputDialogDetails, IQuickInputDialogDetails, IUploadFilesDialogDetails } from './DialogServiceRenderer';
import { IQuickInputItem } from './QuickInputDialog';
import { IUploadedFileDescriptor } from './UploadFileDialog';

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
    showUploadFilesDialog: (options: IUploadFilesDialogDetails) => void;
    showCustomDialog: (options: ICustomDialogDetails) => void;
}

export interface IDialogService {
    showContextMenu: (options: IContextMenuDialogDetails) => void;
    showInputDialog: (options: IInputDialogOptions) => Promise<string | undefined>;
    showQuickInputDialog: (options: IQuickInputDialogOptions) => Promise<IQuickInputItem | undefined>;
    showUploadFilesDialog: () => Promise<IUploadedFileDescriptor[] | undefined>;

    showCustomDialog: (
        dialogComponent: React.ComponentType<ICustomDialogBaseProps>,
        event: React.MouseEvent,
        props?: any
    ) => void;
}
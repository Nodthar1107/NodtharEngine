import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ICommandsProvider } from 'src/core/providers/commandsProvider/ICommandsProvider';
import { IDialogService, IDialogServiceRenderer } from './IDialogService';
import { IDialogRendererRegister } from './ISubscribeRegister';
import { ContextMenu } from './ContextMenu';
import { IQuickInputItem } from './QuickInputDialog';
import { DialogWidget } from './DialogWidget';
import { InputDialog } from './InputDialog';

import 'reflect-metadata';

import './style.scss';

export enum DialogType {
    Context = 'context',

    Input = 'input',

    QuickInput = 'quick-input'
};

export interface ICreateDialogOptions {
    dialogType: DialogType;
    details: ICreateDialogDetails;
    handlerArgs?: any;
}

export interface ICreateDialogDetails {
    title?: string;
    description?: string;
}

export interface ICoords {
    x: number;
    y: number;
}

export interface IContextMenuDialogDetails extends ICreateDialogDetails {
    context: string;
    coords: ICoords;
    handlerArgs?: any;
}

export interface IInputDialogDetails extends ICreateDialogDetails {
    resolve?: (value: string) => void;
}

export interface IQuickInputDialogDetails extends ICreateDialogDetails {
    items: IQuickInputItem[];
    hideInput?: boolean;
}

export interface IDialogServiceProps {
    commandService: ICommandsProvider;
    dialogService: IDialogService;
}

export interface IDialogServiceRendererState {
    type: DialogType | null;
    details: ICreateDialogDetails | null;
    handlerArgs?: any;
}

export class DialogServiceRenderer extends React.Component<IDialogServiceProps, IDialogServiceRendererState> implements IDialogServiceRenderer {
    private dialogMountPoint = document.getElementById('overlay') as HTMLElement;
    
    constructor(props: IDialogServiceProps) {
        super(props);

        this.state = {
            type: null,
            details: null,
            handlerArgs: null
        };
    }

    public componentDidMount(): void {
        (this.props.dialogService as unknown as IDialogRendererRegister).registerDialogRenderer(this);
    }

    public render(): React.ReactNode {
        if (this.state.type === null) {
            return null;
        }

        return ReactDom.createPortal(this.renderDialog(), this.dialogMountPoint);
    }

    public showContextMenu(details: IContextMenuDialogDetails) {
        this.setState({
            type: DialogType.Context,
            details: details,
            handlerArgs: details.handlerArgs
        });
    }

    public showInputDialog(details: IInputDialogDetails) {
        this.setState({
            type: DialogType.Input,
            details: details
        });

        return new Promise<string>((resolve) => {
            resolve('Aboba');
        });
    }

    private renderDialog(): React.ReactNode {
        let content: React.ReactNode | null = null;
        let position: { top: string; left: string } = { top: '0', left: 'auto' };
        let isStyled = true;
        
        switch (this.state.type) {
            case DialogType.Context:
                const coords = (this.state.details as IContextMenuDialogDetails).coords;
                position = { top: `${coords.y}`, left: `${coords.x}` }
                isStyled = false;
                content = this.renderContextMenu();
                break;
            case DialogType.Input:
                content = this.renderInput();
                break;
            case DialogType.QuickInput:
                content = this.renderQuickInput();
                break;
            default:
                content = null;
        }

        return (
            <DialogWidget
                title={this.state.details?.title}
                description={this.state.details?.description}
                position={position}
                isStyled={isStyled}
                onDialogHide={this.onDialogHide.bind(this)}>
                {content}
            </DialogWidget>
        );
    }

    private renderContextMenu(): React.ReactNode {
        const details = this.state.details as IContextMenuDialogDetails;
        const commands = this.props.commandService.getCommandsByContext(details.context);
        
        return (
            <ContextMenu
                commands={commands}
                handlerArgs={this.state.handlerArgs}
                afterCommandHandle={this.onDialogHide.bind(this)}
            />
        );
    }

    private renderInput(): React.ReactNode {
        return <InputDialog closeDialog={this.onDialogHide.bind(this)} sendResponse={(this.state.details as IInputDialogDetails).resolve} />;
    }

    private renderQuickInput(): React.ReactNode {
        return null;
    }

    private onDialogHide() {
        this.setState({
            details: null,
            type: null,
            handlerArgs: null
        });
    }
}
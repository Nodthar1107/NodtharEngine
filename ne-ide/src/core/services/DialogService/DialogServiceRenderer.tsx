import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ICommandsProvider } from 'src/core/providers/commandsProvider/ICommandsProvider';
import { IDialogService, IDialogServiceRenderer } from './IDialogService';
import { IDialogRendererRegister } from './ISubscribeRegister';
import { ContextMenuWidget } from './ContextMenu';
import { IQuickInputItem, QuickInputDialog } from './QuickInputDialog';
import { InputDialogWidget } from './InputDialog';

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
    resolve?: (item: IQuickInputItem) => void;
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
    }

    public showQuickInputDialog(details: IQuickInputDialogDetails) {
        this.setState({
            type: DialogType.QuickInput,
            details: details
        });
    }

    private renderDialog(): React.ReactNode {    
        switch (this.state.type) {
            case DialogType.Context:
                return this.renderContextMenu();
            case DialogType.Input:
                return this.renderInput();
            case DialogType.QuickInput:
                console.log('Switch quick input');
                return this.renderQuickInput();
            default:
                return null;
        }
    }

    private renderContextMenu(): React.ReactNode {
        const details = this.state.details as IContextMenuDialogDetails;
        const commands = this.props.commandService.getCommandsByContext(details.context);
        const coords = (this.state.details as IContextMenuDialogDetails).coords;
        
        return (
            <ContextMenuWidget
                commands={commands}
                position={{
                    top: `${coords.y}`,
                    left: `${coords.x}`
                }}
                isStyled={false}
                handlerArgs={this.state.handlerArgs}
                onDialogHide={this.onDialogHide.bind(this, DialogType.Context)}
            />
        );
    }

    private renderInput(): React.ReactNode {
        const details = this.state.details as IInputDialogDetails;

        return (
            <InputDialogWidget
                title={details.title}
                description={details.description}
                isStyled
                sendResponse={details.resolve}
                onDialogHide={this.onDialogHide.bind(this, DialogType.Input)}
            />
        );
    }

    private renderQuickInput(): React.ReactNode {
        const quickInputDialogDetails = this.state.details as IQuickInputDialogDetails;
        console.log('Render quick input');

        return (
            <QuickInputDialog
                title={quickInputDialogDetails.title}
                description={quickInputDialogDetails.description}
                items={quickInputDialogDetails.items}
                hideInput={quickInputDialogDetails.hideInput as boolean}
                isStyled
                sendResponse={quickInputDialogDetails.resolve}
                onDialogHide={this.onDialogHide.bind(this, DialogType.QuickInput)}
            />
        );
    }

    private onDialogHide(senderWidgetType: DialogType) {
        if (senderWidgetType === this.state.type) {
            this.setState({
                details: null,
                type: null,
                handlerArgs: null
            });
        }
    }
}
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ICommand } from 'src/core/providers/commandsProvider/commands';
import { ICommandsProvider } from 'src/core/providers/commandsProvider/ICommandsProvider';
import { ContextMenuCommand } from './ContextMenuCommand';
import { IDialogService, IDialogServiceRenderer } from './IDialogService';
import { IDialogRendererRegister } from './ISubscribeRegister';
import { ContextMenu } from './ContextMenu';

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

export interface ICreateDialogDetails {}

export interface ICoords {
    x: number;
    y: number;
}

export interface IContextMenuDialogDetails {
    context: string;
    coords: ICoords;
    handlerArgs?: any;
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

    private renderDialog(): React.ReactNode {
        switch (this.state.type) {
            case DialogType.Context:
                return this.renderContextMenu();
            default:
                return null;
        }
    }

    private renderContextMenu(): React.ReactNode {
        const details = this.state.details as IContextMenuDialogDetails;
        const commands = this.props.commandService.getCommandsByContext(details.context);
        
        return (
            <ContextMenu position={details.coords} onContextMenuHide={this.onDialogHide.bind(this)}>
                {commands.map((command: ICommand, index: number) => {
                    return (
                        <ContextMenuCommand
                            title={command.title}
                            hotKey={command.hotKey}
                            handler={this.getCommandHandler(command.execute)}
                            key={index}
                        />
                    );
                })}
            </ContextMenu>    
        );
    }

    private getCommandHandler(execute?: (...args: any) => void): () => void {
        return () => {
            execute?.(this.state.handlerArgs);

            this.onDialogHide();
        };
    }

    private onDialogHide() {
        this.setState({
            details: null,
            type: null,
            handlerArgs: null
        });
    }
}
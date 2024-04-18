import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ICommand } from 'src/core/providers/commandsProvider/commands';
import { ICommandsProvider } from 'src/core/providers/commandsProvider/ICommandsProvider';
import { ContextMenuCommand } from './ContextMenuCommand';
import { IDialogService, IDialogServiceRenderer } from './IDialogService';

import 'reflect-metadata';
import { IDialogRendererRegister } from './ISubscribeRegister';

import './style.scss';

const DIALOG_ROOT_BLOCK = 'dialog-root';

export enum DialogType {
    Context = 'context',

    Input = 'input',

    QuickInput = 'quick-input'
};

export interface ICreateDialogOptions {
    dialogType: DialogType;
    details: ICreateDialogDetails;
}

export interface ICreateDialogDetails {}

export interface ICoords {
    x: number;
    y: number;
}

export interface IContextMenuDialogDetails {
    context: string;
    coords: ICoords;
}

export interface IDialogServiceProps {
    commandService: ICommandsProvider;
    dialogService: IDialogService;
}

export interface IDialogServiceRendererState {
    type: DialogType | null;
    details: ICreateDialogDetails | null;
}

export class DialogServiceRenderer extends React.Component<IDialogServiceProps, IDialogServiceRendererState> implements IDialogServiceRenderer {
    private dialogMountPoint = document.getElementById('overlay') as HTMLElement;
    private dialogRef = React.createRef<HTMLDivElement>();
    
    constructor(props: IDialogServiceProps) {
        super(props);

        this.state = {
            type: null,
            details: null
        };
    }

    public componentDidMount(): void {
        (this.props.dialogService as unknown as IDialogRendererRegister).registerDialogRenderer(this);
    }

    public shouldComponentUpdate(): boolean {
        if (this.dialogRef.current) {
            this.dialogRef.current.addEventListener('click', () => {
                // TODO: Добавить оработку клика за пределами компоненты
            });
        }
        
        return true;
    }

    public render(): React.ReactNode {
        if (this.state.type === null) {
            return null;
        }

        return ReactDom.createPortal(this.renderDialogRoot(), this.dialogMountPoint);
    }

    public showContextMenu(details: IContextMenuDialogDetails) {
        this.setState({
            type: DialogType.Context,
            details: details
        });
    }

    private renderDialogRoot(): React.ReactNode {
        const dialogClass = [
            DIALOG_ROOT_BLOCK,
            this.state.type && `dialog-${this.state.type}`
        ].filter(Boolean).join(' ');

        return (
            <div className={dialogClass} ref={this.dialogRef}>
                {this.renderDialog()}
            </div>
        );
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
        
        const resultCoords = this.getContextMenuRenderCoordinates(details.coords);

        return (
            <div className='context-menu' style={{ top: resultCoords.y, left: resultCoords.x }}>
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
            </div>
        );
    }

    private getContextMenuRenderCoordinates(sourceCoords: ICoords): ICoords {
        return sourceCoords;
    }

    private getCommandHandler(execute?: () => void): () => void {
        return () => {
            execute?.();
        };
    }
}
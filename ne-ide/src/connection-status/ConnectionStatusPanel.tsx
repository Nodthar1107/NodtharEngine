import * as React from 'react';
import { ISubscriber } from '../core/utils/events/ISubscriber';
import { NotificationEvent } from '../core/utils/events/NotificationEvent';
import { ConnectionStatus, IServerDispatcher, ServerDispactherEvents } from '../server-dispatcher/IServerDispatcher';
import { IMessageService } from '../core/services/MessageService/MessageService';

import './style.scss';

interface IConnectionStatusPanelProps {
    serverDispatcher: IServerDispatcher;
    messageService: IMessageService
}

interface IConnectionStatusPanelState {
    status: ConnectionStatus;
}

type Connection = { className: string, statusDescription: string };

export class ConnectionStatusPanel
    extends React.Component<IConnectionStatusPanelProps, IConnectionStatusPanelState>
    implements ISubscriber<ServerDispactherEvents>
{
    private PANEL_CLASS_NAME = 'connection-status-panel';

    constructor(props: IConnectionStatusPanelProps) {
        super(props);

        this.state = {
            status: this.props.serverDispatcher.getConnectionStatus()
        };
    }

    /** @override */
    public fireEvent(event: NotificationEvent<ServerDispactherEvents>) {
        if (event.type === ServerDispactherEvents.CONNECTION_STATUS_UPDATED) {
            const status = this.props.serverDispatcher.getConnectionStatus();

            this.setState({
                status: status
            });

            if (status === ConnectionStatus.CONNECTION_LOST) {
                this.props.messageService.showErrorMessage({
                    title: 'Проблемы соединения',
                    description: 'Соединение с сервером не установлено',
                    ignoreTimeToLive: true
                });
            }
        }
    }

    /** @override */
    public componentDidMount() {
        this.props.serverDispatcher.getEventEmitter().subscribe(this);
    }

    /** @override */
    public render(): React.ReactNode {
        const connection = this.getConnectionDescriptor()

        return (
            <div className={`${this.PANEL_CLASS_NAME} ${connection.className}`}>
                {connection.statusDescription}
            </div>
        );
    }

    private getConnectionDescriptor(): Connection {
        let className = '';
        let text = '';
        
        switch (this.state.status) {
            case ConnectionStatus.PENDING:
                className = this.PANEL_CLASS_NAME + '_pending';
                text = 'Подключение...';
                break;
            case ConnectionStatus.CONNECTED:
                className = this.PANEL_CLASS_NAME + '_connected';
                text = 'Соединение установлено';
                break;
            case ConnectionStatus.CONNECTION_LOST:
                className = this.PANEL_CLASS_NAME + '_lost';
                text = 'Соединение разорвано...';
                break;
        }

        return {
            className: className,
            statusDescription: text
        }
    }
}

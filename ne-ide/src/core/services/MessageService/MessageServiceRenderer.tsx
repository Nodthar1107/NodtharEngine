import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMessageDetails, IMessageRenderer, IMessageService, ITimestampMessage, Severity } from './MessageService';
import { EngineMessage } from './EngineMessage';
import { IIconsProvider } from '../../providers/IIconsProvider';

import './style.scss';

const TIME_TO_LIVE = 15_000;

interface IMessageServiceRendererProps {
    iconProvider: IIconsProvider;
    messageService: IMessageService;
}

interface IMessageServiceRendererState {
    messagesQueue: ITimestampMessage[];
}

export class MessageServiceRenderer extends React.Component<
    IMessageServiceRendererProps,
    IMessageServiceRendererState
> implements IMessageRenderer {
    private mountPoint = document.getElementById('root') as HTMLElement;
    private severityIconsCache = new Map<string, React.ReactElement>();
    private closeButton = React.createElement(this.props.iconProvider.getIconById('close-button'));

    constructor(props: IMessageServiceRendererProps) {
        super(props);

        this.state = {
            messagesQueue: []
        };
    }

    /** @override */
    public componentDidMount(): void {
        this.props.messageService.setRenderer(this);
    }

    /** @override */
    public render(): React.ReactNode {
        if (this.state.messagesQueue.length === 0) {
            return null;
        } 

        return ReactDOM.createPortal(this.renderMessages(), this.mountPoint);
    }

    public renderMessages(): React.ReactNode {
        return (
            <div className='messages-container'>
                {this.state.messagesQueue.map((message: ITimestampMessage, index: number) => {
                    return (
                        <EngineMessage
                            title={message.title}
                            description={message.description}
                            severity={message.severity}
                            severityIcon={this.getIcon(message.severity)}
                            closeButton={this.closeButton}
                            timeToLive={TIME_TO_LIVE}
                            onTimeout={this.onMessageTimeout.bind(this)}
                            close={this.onMessageClose.bind(this, message.timestamp)}  
                        />
                    );
                })}
            </div>
        );
    }

    public showMessage(details: IMessageDetails) {
        const updatedList = this.state.messagesQueue.slice();
        updatedList.unshift({
            ...details,
            timestamp: new Date().valueOf()
        });

        this.setState({
            messagesQueue: updatedList
        });
    }

    private onMessageTimeout() {
        const timestamp = new Date().valueOf();
        const updatedQueue = this.state.messagesQueue.filter((message: ITimestampMessage) => {
            return timestamp - message.timestamp < TIME_TO_LIVE;
        });

        this.setState({
            messagesQueue: updatedQueue
        });
    }

    private onMessageClose(timestamp: number) {
        const messageIndex = this.state.messagesQueue.findIndex((message: ITimestampMessage) => {
            return message.timestamp === timestamp;
        });

        if (messageIndex === -1) {
            return;
        }

        const updatedList = this.state.messagesQueue.slice();
        updatedList.splice(messageIndex, 1);

        this.setState({
            messagesQueue: updatedList
        });
    }

    private getIcon(severity: Severity): React.ReactElement {
        const icon = this.severityIconsCache.get(severity);
        if (icon !== undefined) {
            return icon;
        }

        const newIcon = React.createElement(this.props.iconProvider.getIconById(this.resolveIcon(severity)));
        this.severityIconsCache.set(severity, newIcon);

        return newIcon;
    }

    private resolveIcon(severity: Severity): string {
        return severity + '-icon';
    }
}

import { injectable } from 'inversify';
import { ConnectionStatus, IRpcEvent, IRpcResponseEvent, IServerDispatcher, ResolvePromiseType, ServerDispactherEvents,  } from './IServerDispatcher';
import { EventEmitter } from '../core/utils/events/EventEmitter';
import { IEventEmitter } from '../core/utils/events/IEventEmitter';
import { NotificationEvent } from '../core/utils/events/NotificationEvent';

import 'reflect-metadata'

@injectable()
export class ServerDispatcher implements IServerDispatcher {
    private port = 8000;
    private hostname = 'localhost';
    private connectionStatus = ConnectionStatus.PENDING;

    private socket: WebSocket;
    private eventsQueue: IRpcEvent[] = [];

    private eventEmitter = new EventEmitter<ServerDispactherEvents>();

    constructor() {
        this.socket = new WebSocket(`ws://${this.hostname}:${this.port}`);
        this.socket.addEventListener('open', (event) => {
            this.setConnectionStatus(ConnectionStatus.CONNECTED);
            console.log(`Содеинение с ${this.socket.url} открыто`);

            this.socket.addEventListener('message', (event: MessageEvent<IRpcResponseEvent>) => {
                const response = event.data;
    
                let targetEvent: IRpcEvent | undefined;
                this.eventsQueue.filter((rpcEvent: IRpcEvent) => {
                    if (rpcEvent.timestamp === response.timestamp) {
                        targetEvent = rpcEvent;
    
                        return false;
                    }
    
                    return true;
                })
    
                if (targetEvent) {
                    targetEvent.resolve(response.data);
                }
            });

            this.socket.addEventListener('close', () => {
                this.setConnectionStatus(ConnectionStatus.CONNECTION_LOST);
            })

            this.sendNotification('method/aboba')
        });

        setTimeout(() => {
            if (this.connectionStatus === ConnectionStatus.PENDING) {
                this.setConnectionStatus(ConnectionStatus.CONNECTION_LOST);
            }
        }, 1000);
    }

    public getEventEmitter(): IEventEmitter<ServerDispactherEvents> {
        return this.eventEmitter;
    }

    public sendNotification(method: string): void {
        this.send(method);
    }

    public sendNotificationWithParams(method: string, params: any[]): void {
        this.send(method, params);
    }

    public sendRequest<T>(method: string): Promise<T> {
        return new Promise((resolve) => {
            this.registerRequestEvent(method, resolve);
            this.send(method);
        });
    }

    public sendRequestWithParams<T>(method: string, params?: any[]): Promise<T> {
        return new Promise((resolve) => {
            this.registerRequestEvent(method, resolve);
            this.send(method, params);
        });
    }

    public getConnectionStatus(): ConnectionStatus {
        return this.connectionStatus;
    }
    
    private send(method: string, params?: any[]) {
        this.socket.send(JSON.stringify({
            method: method,
            ...(params && { params: params } ) 
        }));
    }

    private registerRequestEvent(method: string, resolve: ResolvePromiseType) {
        this.eventsQueue.push({
            timestamp: new Date().valueOf(),
            method: method,
            resolve: resolve
        });
    }

    private setConnectionStatus(status: ConnectionStatus) {
        this.connectionStatus = status;

        this.eventEmitter.fireEvent(
            new NotificationEvent<ServerDispactherEvents>(ServerDispactherEvents.CONNECTION_STATUS_UPDATED)
        );
    }
}
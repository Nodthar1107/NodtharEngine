import { injectable } from 'inversify';
import { IRpcEvent, IRpcResponseEvent, IServerDispatcher, ResolvePromiseType } from './IServerDispatcher';

import 'reflect-metadata'

@injectable()
export class ServerDispatcher implements IServerDispatcher {
    private port = 8000;
    private hostname = 'localhost';

    private socket: WebSocket;
    private eventsQueue: IRpcEvent[] = [];

    constructor() {
        this.socket = new WebSocket(`ws://localhost:8000`);
        this.socket.addEventListener('open', (event) => {
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

            this.sendNotification('method/aboba')
        });
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
}
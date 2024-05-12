import { IEventEmitterProvider } from '../core/utils/events/IEventEmitterProvider';

export interface IServerDispatcher extends IEventEmitterProvider<ServerDispactherEvents> {
    sendNotification: (method: string) => void;
    sendNotificationWithParams: (method: string, params: any[]) => void; 
    sendRequest: <T>(method: string) => Promise<T>;
    sendRequestWithParams: <T>(method: string, params: any[]) => Promise<T>;

    getConnectionStatus: () => ConnectionStatus;
}

export enum ConnectionStatus {
    PENDING,

    CONNECTED,

    CONNECTION_LOST
}

export enum ServerDispactherEvents {
    CONNECTION_STATUS_UPDATED
}

export type ResolvePromiseType = (value: any | PromiseLike<void>) => void; 

export interface IRpcEvent {
    timestamp: number;
    method: string;

    resolve: ResolvePromiseType;
}

export interface IRpcResponseEvent {
    timestamp: number;
    data: any;
}

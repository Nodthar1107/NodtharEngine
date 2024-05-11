export interface IServerDispatcher {
    sendNotification: (method: string) => void;
    sendNotificationWithParams: (method: string, params: any[]) => void; 
    sendRequest: <T>(method: string) => Promise<T>;
    sendRequestWithParams: <T>(method: string, params: any[]) => Promise<T>;
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

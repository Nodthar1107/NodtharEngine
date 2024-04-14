import { ISubscriberable } from './ISubscriberable';
import { NotificationEvent } from './NotificationEvent';

export interface IEventEmmiter {
    subscribe: (subscriber: ISubscriberable) => void;

    fireEvent: (event: NotificationEvent) => void;

    fireEvents: (event: NotificationEvent[]) => void;

    dispose: (subscriber: ISubscriberable) => void;

    clear: () => void;
}
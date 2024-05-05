import { ISubscriber } from './ISubscriber';
import { NotificationEvent } from './NotificationEvent';

export interface IEventEmitter<T> {
    subscribe: (subscriber: ISubscriber<T>) => void;

    fireEvent: (event: NotificationEvent<T>) => void;

    fireEvents: (event: NotificationEvent<T>[]) => void;

    dispose: (subscriber: ISubscriber<T>) => void;

    clear: () => void;
}
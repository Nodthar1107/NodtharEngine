import { NotificationEvent } from './NotificationEvent';

export interface ISubscriber<T> {
    fireEvent: (event: NotificationEvent<T>) => void;
}
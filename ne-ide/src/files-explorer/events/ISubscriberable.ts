import { NotificationEvent } from './NotificationEvent';

export interface ISubscriberable {
    fireEvent: (event: NotificationEvent) => void;
}
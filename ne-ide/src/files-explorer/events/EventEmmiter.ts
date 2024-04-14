import { IEventEmmiter } from './IEventEmmiter';
import { ISubscriberable } from './ISubscriberable';
import { NotificationEvent } from './NotificationEvent';

export class EventEmmiter implements IEventEmmiter {
    private subscribers: ISubscriberable[] = [];

    public subscribe(subscriber: ISubscriberable) {
        if (this.subscribers.indexOf(subscriber) === -1) {
            this.subscribers.push(subscriber);
        }
    }

    public fireEvent(event: NotificationEvent) {
        this.fireEvents([event]);
    }

    public fireEvents(event: NotificationEvent[]) {
        this.subscribers.forEach((subscriber: ISubscriberable) => {
            event.forEach((event: NotificationEvent) => subscriber.fireEvent(event));
        });
    }

    public dispose(subscriber: ISubscriberable) {
        const targetElementIndex = this.subscribers.indexOf(subscriber);

        this.subscribers.splice(targetElementIndex, 1);
    }

    public clear() {
        this.subscribers = [];
    }
}
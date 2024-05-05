import { IEventEmitter } from './IEventEmitter';
import { ISubscriber } from './ISubscriber';
import { NotificationEvent } from './NotificationEvent';

export class EventEmitter<T> implements IEventEmitter<T> {
    private subscribers: ISubscriber<T>[] = [];

    public subscribe(subscriber: ISubscriber<T>) {
        if (this.subscribers.indexOf(subscriber) === -1) {
            this.subscribers.push(subscriber);
        }
    }

    public fireEvent(event: NotificationEvent<T>) {
        this.fireEvents([event]);
    }

    public fireEvents(event: NotificationEvent<T>[]) {
        this.subscribers.forEach((subscriber: ISubscriber<T>) => {
            event.forEach((event: NotificationEvent<T>) => subscriber.fireEvent(event));
        });
    }

    public dispose(subscriber: ISubscriber<T>) {
        const targetElementIndex = this.subscribers.indexOf(subscriber);

        this.subscribers.splice(targetElementIndex, 1);
    }

    public clear() {
        this.subscribers = [];
    }
}
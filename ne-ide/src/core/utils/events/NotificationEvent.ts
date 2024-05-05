export class NotificationEvent<T> {
    public readonly type: T;

    constructor(type: T) {
        this.type = type;
    }
}

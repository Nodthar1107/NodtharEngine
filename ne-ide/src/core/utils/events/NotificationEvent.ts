export class NotificationEvent<T> {
    public readonly type: T;
    public readonly payload: any;

    constructor(type: T, payload?: any) {
        this.type = type;
        this.payload = payload;
    }
}

export class NotificationEvent {
    public readonly type: EventType;

    constructor(type: EventType) {
        this.type = type;
    }
}

export enum EventType {
    TREE_VIEW_UPDATED,
    FOLDER_CONTENT_UPDATED
}
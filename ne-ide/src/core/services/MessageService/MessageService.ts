import { injectable } from 'inversify';

import 'reflect-metadata';

export interface IMessageOptions {
    title: string;
    description?: string;
}

export type Severity = 'info' | 'error';

export interface IMessageDetails extends IMessageOptions {
    severity: Severity;
}

export interface ITimestampMessage extends IMessageDetails {
    timestamp: number
}

export interface IMessageService {
    showInfoMessage: (options: IMessageOptions) => void;

    showErrorMessage: (options: IMessageOptions) => void;

    setRenderer: (renderer: IMessageRenderer) => void;
}

export interface IMessageRenderer {
    showMessage: (details: IMessageDetails) => void;
}

@injectable()
export class MessageService implements IMessageService {
    private renderer: IMessageRenderer | null = null;

    public setRenderer(renderer: IMessageRenderer) {
        this.renderer = renderer;
    }

    public showInfoMessage(options: IMessageOptions) {
        if (this.renderer !== null) {
            this.renderer.showMessage({
                ...options,
                severity: 'info'
            });
        }
    }

    public showErrorMessage(options: IMessageOptions) {
        if (this.renderer !== null) {
            this.renderer.showMessage({
                ...options,
                severity: 'error'
            });
        }
    }
}

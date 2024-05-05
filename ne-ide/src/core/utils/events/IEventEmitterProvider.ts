import { IEventEmitter } from './IEventEmitter';

export interface IEventEmitterProvider<T> {
    getEventEmitter: () => IEventEmitter<T>;
}
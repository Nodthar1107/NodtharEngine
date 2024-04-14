import { IEventEmmiter } from './IEventEmmiter';

export interface IEventEmiterProvider {
    getEventEmmiter: () => IEventEmmiter;
}
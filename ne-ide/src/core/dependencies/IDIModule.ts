import { Container } from 'inversify';

/** This interface is used to describe module and register DI-Container rules */
export interface IDIModule {
    registerModule: (container: Container) => void;
}
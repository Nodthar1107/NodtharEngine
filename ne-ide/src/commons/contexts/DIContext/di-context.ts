import { Container } from 'inversify';
import * as React from 'react';

const DIContainer = {
    injector: new Container()
};

export type DIContextType = typeof DIContainer;

export const DIContext = React.createContext<DIContextType>(DIContainer);

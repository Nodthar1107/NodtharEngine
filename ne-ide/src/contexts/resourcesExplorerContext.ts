import * as React from 'react';
import { IEventEmmiter } from '../files-explorer/events/IEventEmmiter';

const initialContext = {
    eventEmmiter: {} as IEventEmmiter
};

export type ResourcesExplorerContextType = typeof initialContext;

export const ResourcesExplorerContext = React.createContext<ResourcesExplorerContextType>(initialContext);

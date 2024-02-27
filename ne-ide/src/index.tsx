import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';
import { Container } from 'inversify';
import { DIContext } from './commons/contexts/DIContext/di-context';
import { ActivityBarModule } from './activity-bar/module';
import { CoreModule } from './core/module';
import { IDIModule } from './commons/IDIModule';

import 'reflect-metadata';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const injector = new Container();

[new ActivityBarModule(), new CoreModule()].forEach((module: IDIModule) => {
    module.registerModule(injector);
})

root.render(
    <React.StrictMode>
        <DIContext.Provider value={{ injector: injector }}>
            <App />
        </DIContext.Provider>
    </React.StrictMode>
);

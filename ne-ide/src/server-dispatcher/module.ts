import { Container } from 'inversify';
import { IDIModule } from '../core/dependencies/IDIModule';
import { SERVER_DISPATCHER_TYPES } from './module-types';
import { ServerDispatcher } from './ServerDispatcher';

export class ServerDispatcherModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind(SERVER_DISPATCHER_TYPES.IServerDispatcher)
            .to(ServerDispatcher);
    }
}

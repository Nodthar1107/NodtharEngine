import { injectable } from 'inversify';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';
import { IBlueprintDescriptor } from './model';

import 'reflect-metadata';

@injectable()
export class BlueprintsInfoProviderMockImpl implements IBlueprintsInfoProvider {
    public getBlueprintsDescriptors(): IBlueprintDescriptor[] {
        return [
            {
                label: 'PrintString',
                description: 'Выводит строку в поток печати',
                group: 'Commons',
                nodeId: 'print-string',
            },
            {
                label: 'SetRelativeCoordinates',
                description: 'Устанавливает относительное значение координатного вектора',
                group: 'Actor',
                nodeId: 'set-relative-coordinates'
            },
            {
                label: 'SetAbsoluteCoordinates',
                description: 'Устанавливает относительное значение координатного вектора',
                group: 'Actor',
                nodeId: 'set-relative-coordinates'
            },
            {
                label: 'SetRelativeRotation',
                description: 'Устанавливает относительное значение вектора вращения',
                group: 'Actor',
                nodeId: 'set-relative-coordinates'
            },
            {
                label: 'SetAbsoluteRotation',
                description: 'Устанавливает абсолютное значение вектора вращения',
                group: 'Actor',
                nodeId: 'set-absolute-coordinates'
            },
        ]
    }
}
import * as React from 'react';
import { IEditorsManager } from '../managers/IEditorsManager';
import { ResourceType } from '../../files-explorer/ResourcesManager/ResourceType';

export interface IAbstratcEditorProps {

}

export class AbstractEditor<P extends IAbstratcEditorProps, S> extends React.Component<P, S> {
    constructor(props: P) {
        super(props);
    }
}

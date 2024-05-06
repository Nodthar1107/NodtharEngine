import * as React from 'react';
import { IEditorsManager } from '../managers/IEditorsManager';

export interface IEditor {
    // empty
}

export interface IAbstratcEditorProps {

}

export class AbstractEditor<P extends IAbstratcEditorProps, S> extends React.Component<P, S> implements IEditor {
    constructor(props: P) {
        super(props);
    }
}

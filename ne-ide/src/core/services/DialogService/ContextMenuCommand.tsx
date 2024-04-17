import * as React from 'react';

import './style.scss';

export interface IContextMenuCommandProps {
    title: string;

    hotKey?: string;

    handler?: () => void;
}

export const ContextMenuCommand: React.FC<IContextMenuCommandProps> = (
    props: IContextMenuCommandProps
): React.ReactElement => {
    return (
        <div className='context-menu-item' onClick={props.handler}>
            <div className='context-menu-item__title'>
                {props.title}
            </div>
            <div className='context-menu-item__hot-key'>
                {props.hotKey}
            </div>
        </div>
    )
}

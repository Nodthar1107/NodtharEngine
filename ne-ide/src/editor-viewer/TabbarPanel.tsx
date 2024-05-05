import * as React from 'react';

import { Close } from '../core/icons/Commons/Close';

import './style.scss';
import { ITabbarItem } from './EditorViewer';

interface ITabbarProps {
    editorDescriptors: ITabbarItem[];
    activeTabUri: string | undefined;

    onTabItemClick: (index: number) => void;
    onTabItemClose: (index: number) => void;
}

export const TabbarPanel: React.FC<ITabbarProps> = (props: ITabbarProps): React.ReactElement => {
    return (
        <div className='tabbar-panel'>
            {props.editorDescriptors.map((descriptor: ITabbarItem, index: number) => {
                return (
                    <TabbarItem
                        label={descriptor.label}
                        uri={descriptor.uri}
                        closable={descriptor.closable}
                        active={descriptor.uri === props.activeTabUri}
                        onTabItemClick={() => { props.onTabItemClick(index) }}
                        onTabItemClose={() => props.onTabItemClose(index)}
                    />
                );
            })}
        </div>
    );
}

interface ITabbarItemProps {
    label: string;

    active: boolean;

    uri: string;

    closable?: boolean;

    onTabItemClick: () => void;
    onTabItemClose: () => void;
}

const TabbarItem: React.FC<ITabbarItemProps> = (props: ITabbarItemProps): React.ReactElement => {
    const tabItemClassName = 'tabbar-item' + (props.active ? ' tabbar-item_active' : '');
    
    return (
        <div className={tabItemClassName} title={props.uri} onClick={props.onTabItemClick}>
            <div className='tabbar-item__label'>{props.label}</div>
            {props.closable && (
                <div
                    className='tabbar-item__close-button'
                    onClick={(event) => {
                        event.stopPropagation();
                        props.onTabItemClose();
                    }}>
                    <Close />
                </div>
            )}
        </div>
    );
} 

import * as React from 'react';
import { IIconProps } from '../../icons/IIconProps';
import { withDialogWidget } from './withDialogWidget';

import './style.scss';

export interface IQuickInputItem {
    label: string;
    description?: string;
    meta?: string;
    icon?: React.FC<IIconProps>;
}

export interface IQuickInputProps {
    items: IQuickInputItem[];
    hideInput?: boolean;

    onDialogHide: () => void;
    sendResponse?: (item: IQuickInputItem) => void;
}

const QuickInput: React.FC<IQuickInputProps> = (props: IQuickInputProps): React.ReactElement => {
    const [inputValue, setInputValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const onItemSelect = (item: IQuickInputItem) => {
        props.onDialogHide();
        props.sendResponse?.(item);
    }

    return (
        <div className='quick-input-dialog'>
            {!props.hideInput && (
                <input
                    className='quick-input-dialog__input'
                    value={inputValue}
                    onChange={(event) => {
                        setInputValue(event.target.value)
                    }}
                    ref={inputRef}
                />
            )}
            <div className='quick-input-dialog__list'>
                {props.items.map((item: IQuickInputItem, index: number) => {
                    return (
                        <QuickInputItem 
                            label={item.label}
                            description={item.description}
                            icon={item.icon}
                            onSelect={() => onItemSelect(item)}
                            key={index}
                        />
                    );
                })}
            </div>
        </div>
    );
}

interface QuickInputItemProps {
    label: string;
    description?: string;
    icon?: React.FC<IIconProps>;

    onSelect: () => void;
}

const QuickInputItem: React.FC<QuickInputItemProps> = (props: QuickInputItemProps): React.ReactElement => {
    return (
        <div className='quick-input-item' onClick={props.onSelect}>
            <div className='quick-input-item__icon'>
                {props.icon && React.createElement(props.icon)}
            </div>
            <div className='quick-input-item__label'>{props.label}</div>
            <div className='quick-input-item__description'>{props.description}</div>
        </div>
    );
}

export const QuickInputDialog = withDialogWidget(QuickInput);

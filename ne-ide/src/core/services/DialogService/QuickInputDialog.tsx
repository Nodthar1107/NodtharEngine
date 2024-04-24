import * as React from 'react';
import { IIconProps } from '../../icons/IIconProps';

export interface IQuickInputItem {
    label: string;
    description?: string;
    meta?: string;
    icon?: React.FC<IIconProps>;
}

export interface IQuickInputProps {
    items: IQuickInputItem[];
    title?: string;
    description?: string;
    hideInput?: string;
}

export const QuickInputDialog: React.FC = (): React.ReactElement => {
    return (
        <div className='quick-input-dialog'>

        </div>
    );
}

interface QuickInputItemProps {
    label: string;
    description?: string;
    icon?: React.FC<IIconProps>;
}

const QuickInputItem: React.FC<QuickInputItemProps> = (props: QuickInputItemProps): React.ReactElement => {
    return (
        <div className='quick-input-item'>
            <div className='quick-input-item__icon'>
                {props.icon && React.createElement(props.icon)}
            </div>
            <div className='quick-input-item__label'>{props.label}</div>
            <div className='quick-input-item__description'>{props.description}</div>
        </div>
    );
}

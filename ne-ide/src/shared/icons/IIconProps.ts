import * as React from 'react';

export interface IIconProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?: () => void;
}
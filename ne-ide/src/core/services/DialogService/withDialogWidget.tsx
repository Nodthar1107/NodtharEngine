import * as React from 'react';

import './style.scss';
import { DialogType } from './DialogServiceRenderer';

const DIALOG_WIDGET = 'dialog-widget';

export interface IDialogWidgetProps {
    children: React.ReactNode[] | React.ReactNode;
    onDialogHide: () => void;

    title?: string;
    description?: string;

    isStyled?: boolean;
    
    position?: Position;
}

type Position = { top: string; left: string; };
const DEFAULT_POSITION = {
    top: '0',
    left: '0'
};

export interface IWithDialogWidgetBaseProps {
    onDialogHide?: () => void;
}

export interface IWithDialogAdditionalProperties {
    title?: string;
    description?: string;
    isStyled?: boolean;
    position?: Position;

    sendResponse?: (value: any) => void;
}

export function withDialogWidget<T extends IWithDialogWidgetBaseProps>(Component: React.ComponentType<T>) {
    const NewComponent = (props: T & IWithDialogAdditionalProperties) => {
        const contextMenuRef = React.useRef<HTMLDivElement>(null);
        const [showDialog, setShowDialog] = React.useState(false);
        const [coords, setCoords] = React.useState<Position>(props.position || DEFAULT_POSITION);
        const coordsRef = React.useRef(coords);

        const clickEventHandlerRef = React.useRef((event: MouseEvent) => {
            const clickedElement = (event.target as HTMLElement);
            if (!clickedElement.classList.contains(DIALOG_WIDGET) && !hasParent(clickedElement, contextMenuRef.current)) {
                props.sendResponse?.(undefined);
                props.onDialogHide?.();
            }
        });

        const getPositionAccordinToWindowHeight = (): Position => {
            const dialogRect = contextMenuRef.current?.getBoundingClientRect() as DOMRect;
            const position: Position = { top: coordsRef.current.top, left: coordsRef.current.left};
            if (dialogRect.y + dialogRect.height > window.innerHeight) {
                position.top = `${window.innerHeight - dialogRect.height}`;
            }

            if (dialogRect.x + dialogRect.width > window.innerWidth) {
                position.left = `${window.innerWidth - dialogRect.width}`;
            }

            return position;
        }

        React.useEffect(() => {
            coordsRef.current = props.position || DEFAULT_POSITION;
            setCoords(getPositionAccordinToWindowHeight());
        }, [props.position]);

        React.useEffect(() => {
            document.addEventListener('click', clickEventHandlerRef.current, true);

            setCoords(getPositionAccordinToWindowHeight());
            setShowDialog(true);

            return () => {
                document.removeEventListener('click', clickEventHandlerRef.current, true);
            }
        }, []);

        const className = [
            DIALOG_WIDGET,
            props.isStyled && `${DIALOG_WIDGET}_styled`
        ].filter(Boolean).join(' ');

        return (
            <div
                className={className}
                style={{
                    ...!props.isStyled && {
                        top: coords.top + 'px',
                        left: coords.left + 'px',
                    },
                    visibility: showDialog ? 'visible' : 'hidden'
                }}
                ref={contextMenuRef}>
                {props.title && <div className={DIALOG_WIDGET + '__title'}>{props.title}</div>}
                {props.description && <div className={DIALOG_WIDGET + '__description'}>{props.description}</div>}
                <Component {...props} />
            </div>
        );
    }

    return NewComponent;
}

function hasParent(element: HTMLElement, parent: HTMLElement | null): boolean {
    if (parent === null) {
        return false;
    }
    
    let currentLevelParent = element.parentElement;
    while (currentLevelParent !== null) {
        if (currentLevelParent.classList.contains(DIALOG_WIDGET)) {
            return true;
        }

        currentLevelParent = currentLevelParent.parentElement;
    }

    return false;
}

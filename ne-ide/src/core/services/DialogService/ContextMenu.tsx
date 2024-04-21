import * as React from 'react';
import { ICoords } from './DialogServiceRenderer';

import './style.scss';

export interface IContextMenuPropsProps {
    children: React.ReactNode[] | React.ReactNode;
    onContextMenuHide: () => void;

    position?: ICoords;
}

type Position = { top: number; left: number };

export const ContextMenu: React.FC<IContextMenuPropsProps> = (props: IContextMenuPropsProps) => {
    const contextMenuRef = React.useRef<HTMLDivElement>(null);
    const [showContext, setShowContext] = React.useState(false);
    const [coords, setCoords] = React.useState<Position>({ top: props.position?.y || 0, left: props.position?.x || 0 });
    const coordsRef = React.useRef(coords);

    const clickEventHandlerRef = React.useRef((event: MouseEvent) => {
        const clickedElement = (event.target as HTMLElement);
        if (!clickedElement.classList.contains('context-menu') && !hasParent(clickedElement, contextMenuRef.current)) {
            props.onContextMenuHide();
        }
    });

    const getPositionAccordinToWindowHeight = (): Position => {
        const dialogRect = contextMenuRef.current?.getBoundingClientRect() as DOMRect;
        const position: Position = { top: coordsRef.current.top, left: coordsRef.current.left};
        if (dialogRect.y + dialogRect.height > window.innerHeight) {
            position.top = window.innerHeight - dialogRect.height;
        }

        if (dialogRect.x + dialogRect.width > window.innerWidth) {
            position.left = window.innerWidth - dialogRect.width;
        }

        return position;
    }

    React.useEffect(() => {
        coordsRef.current = { top: props.position?.y || 0, left: props.position?.x || 0 };
        setCoords(getPositionAccordinToWindowHeight());
    }, [props.position]);

    React.useEffect(() => {
        document.addEventListener('click', clickEventHandlerRef.current);

        setCoords(getPositionAccordinToWindowHeight());
        setShowContext(true);

        return () => {
            document.removeEventListener('click', clickEventHandlerRef.current);
        }
    }, []);

    return (
        <div
            className='context-menu'
            style={{
                ...props.position,
                ...coords,
                visibility: showContext ? 'visible' : 'hidden'
            }}
            ref={contextMenuRef}>
            {props.children}
        </div>
    );
}

function hasParent(element: HTMLElement, parent: HTMLElement | null): boolean {
    if (parent === null) {
        return false;
    }
    
    let currentLevelParent = element.parentElement;
    while (currentLevelParent !== null) {
        if (currentLevelParent === parent) {
            return true;
        }

        currentLevelParent = currentLevelParent.parentElement;
    }

    return false;
}

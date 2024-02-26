import * as React from 'react';

import './style.css';

interface IResizablePanelProps {
    direction: 'vertical' | 'horizontal';
    resizePosition: 'top' | 'bottom' | 'right' | 'left';
    className?: string;

    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;

    children?: React.ReactElement | React.ReactElement[] | string;
    style?: React.CSSProperties;
}

export const ResizablePanel: React.FC<IResizablePanelProps> = (props: IResizablePanelProps): React.ReactElement => {
    const resizableBarRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const onMouseDownHandlerRef = React.useRef(() => {
        document.body.style.cursor = props.direction === 'horizontal' ? 'row-resize' : 'col-resize';
        document.addEventListener('mousemove', onMouseMoveHandlerRef.current);
    });

    const onMouseMoveHandlerRef = React.useRef((event: MouseEvent) => {
        event.preventDefault();

        if (event.buttons === 0) {
            document.body.style.cursor = 'default';
            document.removeEventListener('mousemove', onMouseMoveHandlerRef.current);
            
            return;
        }

        const containerBlock = containerRef.current as HTMLDivElement;

        if (props.direction === 'vertical') {
            const currentWidth = (props.resizePosition === 'right' ? event.movementX : -event.movementX) + containerBlock.clientWidth;
            containerBlock.style.width = `${currentWidth}px`;

            return;
        }

        const currentHeight = (props.resizePosition === 'bottom' ? event.movementY : -event.movementY) + containerBlock.clientHeight;
        containerBlock.style.height = `${currentHeight}px`;
    });
    
    React.useEffect(() => {
        (resizableBarRef.current as HTMLDivElement).addEventListener(
            'mousedown',
            onMouseDownHandlerRef.current
        );
    }, []);

    const className = [
        'resizable-panel',
        `resizable-panel_direction-${props.direction}`,
        `resizable-panel_resize-panel-position-${props.resizePosition}`,
        props.className
    ]
        .filter(Boolean)
        .join(' ');
    
    return (
        <div
            className={className}
            style={{
                ...props.style,
                minWidth: props.minWidth,
                maxWidth: props.maxWidth,
                minHeight: props.minHeight,
                maxHeight: props.maxHeight
            }}
            ref={containerRef}>
            <div className='resizable-panel__resize-bar' ref={resizableBarRef}></div>
            <div className='resizable-panel__content'>
                {props.children}
            </div>
        </div>
    )
} 

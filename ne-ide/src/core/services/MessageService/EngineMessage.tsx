import * as React from 'react';

import './style.scss';

interface IEngineMessageProps {
    title: string;
    severityIcon: React.ReactElement;
    severity: string;
    timeToLive: number;
    ignoreTimeToLive?: boolean;

    closeButton: React.ReactElement;

    description?: string;

    onTimeout: () => void;
    close: () => void;
}

export const EngineMessage: React.FC<IEngineMessageProps> = (
    props: IEngineMessageProps
): React.ReactElement => {
    React.useEffect(() => {
        setTimeout(props.onTimeout, props.timeToLive);
    }, []);

    
    return (
        <div className='engine-message'>
            <div className={`engine-message__severity-icon engine-message__severity-icon_${props.severity}`}>{props.severityIcon}</div>
            <div className='engine-message__content'>
                <div className='engine-message__header'>
                    <div className='engine-message__title'>
                        {props.title}
                    </div>
                    <div className='engine-messages__close-button' onClick={props.close}>
                        {props.closeButton}
                    </div>
                </div>
                <div className='engine-message__description'>
                    {props.description}
                </div>
            </div>
        </div>
    );
}

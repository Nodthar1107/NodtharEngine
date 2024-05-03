import * as React from 'react';

import './style.scss';
import { withDialogWidget } from './withDialogWidget';

interface IInputDialogProps {
    onDialogHide?: () => void;
    sendResponse?: (value: string) => void;
}

const InputDialog: React.FC<IInputDialogProps> = (props: IInputDialogProps): React.ReactElement => {
    const [value, setValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }

    // TODO: Исправить на установку фокуса при монтировании
    React.useEffect(() => {
        inputRef.current?.focus();
    });

    return (
        <div className='input-dialog'>
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    props.onDialogHide?.();
                    props.sendResponse?.(value);
                }}>
                <input
                    value={value}
                    ref={inputRef}
                    onChange={onValueChange}
                />
            </form>
        </div>
    );
}

export const InputDialogWidget = withDialogWidget(InputDialog);

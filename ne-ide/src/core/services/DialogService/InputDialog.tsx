import * as React from 'react';

import './style.scss';

interface IInputDialogProps {
    closeDialog?: () => void;
    sendResponse?: (value: string) => void;
}

export const InputDialog: React.FC<IInputDialogProps> = (props: IInputDialogProps): React.ReactElement => {
    const [value, setValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }

    React.useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className='input-dialog'>
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    console.log('Submit')
                    console.log(props);

                    props.closeDialog?.();
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

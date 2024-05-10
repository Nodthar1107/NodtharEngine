import * as React from 'react';
import { ControlProps, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';

import '../style.scss';

export const InputStringTester = rankWith(
    100,
    uiTypeIs('StringControl')
);

const InputString: React.FC<ControlProps> = (
    props: ControlProps
): React.ReactElement => {
    const [value, setValue] = React.useState<string>(props.data);

    React.useEffect(() => {
        setValue(props.data as string)
    }, [props.data]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        props.handleChange(props.path, event.target.value);
    }

    return (
        <div className='input-string-control'>
            <label className='input-string-control__label'>{props.label}</label>
            <input className='input-string-control__input' value={value} onChange={onChange} />
        </div>
    );
}

export const InputStringControl = withJsonFormsControlProps(InputString);

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
    return (
        <div className='input-string-control'>
            <span className='input-string-control__label'>{props.label}</span>
            <input className='input-string-control__input' value={props.data} />
        </div>
    );
}

export const InputStringControl = withJsonFormsControlProps(InputString);

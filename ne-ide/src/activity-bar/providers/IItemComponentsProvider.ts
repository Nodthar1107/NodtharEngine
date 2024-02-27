import * as React from 'react';

export interface IItemComponentsProvider {
    getItems: () => React.ReactElement[];
}
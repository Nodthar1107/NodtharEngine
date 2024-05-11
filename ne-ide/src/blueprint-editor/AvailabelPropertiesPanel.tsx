import * as React from 'react';
import { IBlueprintsInfoProvider } from './IBlueprintInfoProvider';
import { withSimpleCollapsePanel } from '../core/hocs/simpleCollapsePanel/withSimpleCollapsePanel';

import './style.scss';

interface IAvailabelPropertiesPanel {
    bluprintInfoProvider: IBlueprintsInfoProvider;
}

const AvailabelProperties: React.FC<IAvailabelPropertiesPanel> = (
    props: IAvailabelPropertiesPanel
): React.ReactElement => {
    return (
        <div className='availabel-properties-panel'>
            <div className='availabel-properties-panel__header'>
                Список доступных для данного блюпринта свойств
            </div>
        </div>
    );
}

export const AvailabelPropertiesPanel = withSimpleCollapsePanel(AvailabelProperties);

import * as React from 'react';
import { IBlueprintDescriptor } from './model';
import { ICustomDialogBaseProps } from '../core/services/DialogService/DialogServiceRenderer';
import { Accordion } from '../core/ui-components/Accordion/Accordion';
import { AccordionSummary } from '../core/ui-components/Accordion/AccordionSummary';
import { AccordionDetails } from '../core/ui-components/Accordion/AccordionDetails';

interface IBlueprintsListViewProps extends ICustomDialogBaseProps {
    descriptors: IBlueprintDescriptor[];
}

export const BlueprintsListView: React.FC<IBlueprintsListViewProps> = (props: IBlueprintsListViewProps): React.ReactElement => {
    const groups = React.useMemo(() => {
        const groupsMap = new Map<string, IBlueprintDescriptor[]>();
        props.descriptors.forEach((descriptor: IBlueprintDescriptor) => {
            if (!groupsMap.has(descriptor.group)) {
                groupsMap.set(descriptor.group, []);
            }

            groupsMap.get(descriptor.group)?.push(descriptor);
        })

        return groupsMap;
    }, [props.descriptors]);

    return (
        <div className='blueprints-list-view'>
            <div className='blueprints-list-view__header'>
                Доступные блоки
            </div>
            {Array.from(groups.entries())
                .sort(BlueprintsGroupsComparator)
                .map((group: BlueprintsGroup, index: number) => {
                    return <BlueprintsGroup label={group[0]} descriptors={group[1]} key={index} />;
                }
            )}
        </div>
    );
}

type BlueprintsGroup = [string, IBlueprintDescriptor[]];

function BlueprintsGroupsComparator(first: BlueprintsGroup, second: BlueprintsGroup): number {
    return first[0] < second[0] ? 1 : -1; 
}

interface IBlueprintsGroupProps {
    label: string;
    descriptors: IBlueprintDescriptor[]
}

const BlueprintsGroup: React.FC<IBlueprintsGroupProps> = (props: IBlueprintsGroupProps): React.ReactElement => {
    const summary = <AccordionSummary className='blueprints-list-view-group__label'>{props.label}</AccordionSummary>;
    const details = (
        <AccordionDetails className='blueprints-list-view-group__content'>
                {props.descriptors.map((descriptor: IBlueprintGroupItem, index: number) => {
                    return (
                        <BlueprintGroupItem
                            label={descriptor.label}
                            description={descriptor.description}
                            icon={descriptor.icon}
                            key={index}    
                        />
                    );
                })}
            </AccordionDetails>
    );
    
    return (
        <Accordion className='blueprints-list-view-group' details={details} summary={summary} />
    );
}

interface IBlueprintGroupItem {
    label: string;
    description: string;
    icon?: React.ReactElement;
}

const BlueprintGroupItem: React.FC<IBlueprintGroupItem> = (props: IBlueprintGroupItem): React.ReactElement => {
    return (
        <div className='blueprint-group-item' title={props.description}>
            <div className='blueprint-group-item__icon'>{props.icon}</div>
            <div className='blueprint-group-item__label'>{props.label}</div>
        </div>
    );
}
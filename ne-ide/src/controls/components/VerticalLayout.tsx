import { Layout, LayoutProps, rankWith, UISchemaElement, uiTypeIs } from "@jsonforms/core";
import { JsonFormsDispatch, withJsonFormsLayoutProps } from "@jsonforms/react";
import * as React from "react";

export const VerticalLayoutTester = rankWith(
    15,
    uiTypeIs('VerticalLayout')
);

const VerticalLayoutRenderer: React.FC<LayoutProps> = (props: LayoutProps) => {
    const elements = (props.uischema as Layout).elements
    
    return (
        <>
            {elements.map((element: UISchemaElement) => {
                return (
                    <JsonFormsDispatch
                        schema={props.schema}
                        uischema={element}
                        path={props.path}
                        enabled={props.enabled}
                        cells={props.cells}
                    />
                );
            })}
        </>
    )
}

export const VerticalLayout = withJsonFormsLayoutProps(VerticalLayoutRenderer);

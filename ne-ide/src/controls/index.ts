import { JsonFormsRendererRegistryEntry } from "@jsonforms/core";
import { InputStringControl, InputStringTester } from "./components/InputStringControl";
import { VerticalLayout, VerticalLayoutTester } from "./components/VerticalLayout";

export const blueprintRenderers: JsonFormsRendererRegistryEntry[] = [
    {
        tester: VerticalLayoutTester,
        renderer: VerticalLayout
    },
    {
        tester: InputStringTester,
        renderer: InputStringControl
    }
]
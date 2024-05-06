import { ReactNode } from "react";
import { AbstractEditor, IAbstratcEditorProps } from "./AbstractEditor";

interface ITextEditorProps extends IAbstratcEditorProps {

}

export class TextEditor extends AbstractEditor<ITextEditorProps, {}> {
    constructor(props: ITextEditorProps) {
        super(props);
    }

    public render(): ReactNode {
        return <div className="text-editor"></div>;
    }
}
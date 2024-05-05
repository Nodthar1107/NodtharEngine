import * as React from 'react'
import { withDialogWidget } from './withDialogWidget';

import './style.scss';

export interface IUploadedFileDescriptor {
    label: string;

}

interface IUploadFilesProps {
    sendResponse?: (value: any) => void;
    onDialogHide?: () => void;
}

const UploadFiles: React.FC<IUploadFilesProps> = (props: IUploadFilesProps): React.ReactElement => {
    const [isDrag, setIsDrag] = React.useState(false);

    const onDragStart = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDrag(true);
    }

    const onDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDrag(false);
    }

    const downloadFiles = (files: FileList | null) => {
        props.onDialogHide?.();
        if (files !== null) {
            props.sendResponse?.(Array.from(files).map<IUploadedFileDescriptor>((file: File) => {
                return {
                    label: file.name
                }
            }));

            return;
        }

        props.sendResponse?.(undefined);
    }

    const onDropHandler = (event: React.DragEvent) => {
        event.preventDefault();
        downloadFiles(event.dataTransfer.files);
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        downloadFiles(event.target.files);
    }
    
    return (
        <div className='upload-files-dialog'>
                <label className='upload-files-dialog__view-button'>
                    <input type='file' multiple onChange={onChange} />
                    Обзор
                </label>
            {isDrag && (   
                <div
                    className='upload-files-dialog__drop-area upload-files-dialog__drop-area_dragable'
                    onDragStart={onDragStart}
                    onDragOver={onDragStart}
                    onDragLeave={onDragLeave}
                    onDrop={onDropHandler}>
                    Отпустите, чтобы загрузить файлы
                </div>
            ) || (
                <div
                    className='upload-files-dialog__drop-area'
                    onDragStart={onDragStart}
                    onDragOver={onDragStart}
                    onDragLeave={onDragLeave}>
                    Или перетащите сюда файлы
                </div>
            )}
        </div>
    );
}

export const UploadFilesDialog = withDialogWidget(UploadFiles);

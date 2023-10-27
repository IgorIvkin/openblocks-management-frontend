import './TaskFiles.css';
import React, {useEffect, useState} from "react";
import TaskClient from "../../../clients/TaskClient";

function TaskFile({file, onDelete, onDownload}) {

    let [image, setImage] = useState('');

    useEffect(() => {
        console.log(file);
        downloadPictureContent();
    }, []);

    function onClickDeleteFile() {
        if (onDelete) {
            onDelete(file);
        }
    }

    function onClickDownloadFile() {
        if (onDownload) {
            onDownload(file);
        }
    }

    function isPicture() {
        return file?.mimeType === 'image/jpeg';
    }

    async function downloadPictureContent() {
        if (file && isPicture()) {
            const response = await TaskClient.getFile(file.id);
            const imageObjectURL = URL.createObjectURL(response.data);
            setImage(imageObjectURL);
        }
    }

    return (
        <div className={"task-file-item file-grid"}>
            <div className={"task-file-delete"}
                 onClick={onClickDeleteFile}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5001 6H3.5"/>
                    <path
                        d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"/>
                    <path
                        d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"/>
                </svg>
            </div>
            {isPicture() &&
                <div className={"task-file-file"}
                     onClick={onClickDownloadFile}>
                    <div className={"task-file-picture"}
                         style={{
                             backgroundImage: "url(" + image + ")",
                             height: "50px",
                             width: "100px"
                         }}>

                    </div>
                    <div className={"text-file-info"}>
                        <span>{file.fileName}</span>
                    </div>
                </div>}
            {!isPicture() &&
                <div className={"task-file-file"}
                     onClick={onClickDownloadFile}>
                    <div className={"task-file-icon"}>
                        <svg viewBox="0 -8 72 72"
                             id="Layer_1"
                             data-name="Layer 1"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M47.76,36.76H23.28a1.08,1.08,0,1,0,0,2.16H47.76a1.08,1.08,0,0,0,0-2.16Z"/>
                            <path d="M47.76,22.6H23.28a1.08,1.08,0,1,0,0,2.16H47.76a1.08,1.08,0,1,0,0-2.16Z"/>
                            <path
                                d="M46.92,0H18.74A3.44,3.44,0,0,0,15.3,3.43V52.57A3.44,3.44,0,0,0,18.74,56H53.26a3.44,3.44,0,0,0,3.44-3.43V10.62Zm.81,5.14L52,9.79H47.73Zm6.08,47.43a.55.55,0,0,1-.55.55H18.74a.55.55,0,0,1-.55-.55V3.43a.54.54,0,0,1,.55-.54H44.85v8.35a1.45,1.45,0,0,0,1.44,1.44h7.52Z"/>
                            <path d="M47.76,29.62H23.28a1.08,1.08,0,1,0,0,2.16H47.76a1.08,1.08,0,1,0,0-2.16Z"/>
                        </svg>
                    </div>
                    <div className={"text-file-info"}>
                        <span>{file.fileName}</span>
                    </div>
                </div>}
        </div>
    );

}

export default TaskFile;
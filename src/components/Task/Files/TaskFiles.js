import './TaskFiles.css';
import React, {useState, useEffect} from "react";
import TaskClient from "../../../clients/TaskClient";
import TaskFile from "./TaskFile";

function TaskFiles({taskCode}) {

    let [taskFiles, setTaskFiles] = useState([]);
    let [isAddFile, setIsAddFile] = useState(false);

    async function getTaskFiles() {
        try {
            if (taskCode) {
                let response = await TaskClient.getTaskFiles(taskCode);
                setTaskFiles(response.data);
            }
        } catch (error) {
            console.log("Cannot get task files, reason: " + error);
        }
    }

    useEffect(() => {
        getTaskFiles();
    }, []);

    function openAddFile() {
        setIsAddFile(true);
    }

    async function onAddFile(event) {
        let fileInput = event.target;
        if (fileInput) {
            await TaskClient.addTaskFile(taskCode, fileInput);
            await getTaskFiles();
        }
        setIsAddFile(false);
    }

    async function onDeleteFile(file) {
        if (file?.id) {
            await TaskClient.deleteTaskFile(taskCode, file.id);
        }
        await getTaskFiles();
    }

    async function onDownloadFile(file) {
        if (file?.id) {
            await TaskClient.downloadFile(file.id, file.fileName);
        }
    }

    return (
        <div className={"task-files"}>
            <div className={"task-files-header"}>
                <h3>Файлы и вложения</h3>
                <div className={"task-files-add"}
                     onClick={openAddFile}>
                    <svg viewBox="0 0 22 22"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17H10V12H5V10H10V5H12V10H17V12H12Z"/>
                    </svg>
                    <span>Добавить</span>
                </div>
            </div>

            <div className={"task-files-list"}>
                {taskFiles.map((file, i) => {
                    return (
                        <TaskFile file={file}
                                  key={file?.id}
                                  onDelete={onDeleteFile}
                                  onDownload={onDownloadFile}/>
                    );
                })}
                {(isAddFile || taskFiles?.length > 0) &&
                    <div className={"task-file-item task-files-add-form"}>
                        <label className={"task-files-input"}>
                            <input type={"file"} name={"file"}
                                   onChange={onAddFile}/>
                            <div className={"task-file-add-button"}>
                                Выберите файл
                            </div>
                        </label>
                    </div>}
            </div>

        </div>
    );

}

export default TaskFiles;
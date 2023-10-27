import './TaskLinks.css'
import React, {useEffect, useState} from "react";
import TaskClient from "../../../clients/TaskClient";
import ReferenceService from "../../../service/ReferenceService";
import SelectBox from "../../Input/SelectBox";
import TaskAutocomplete from "./TaskAutocomplete";
import TaskLink from "./TaskLink";

function TaskLinks({taskCode}) {

    let [taskLinks, setTaskLinks] = useState([]);
    let [taskLinkTypes, setTaskLinkTypes] = useState([]);
    let [isAddLink, setIsAddLink] = useState(false);
    let [addTaskLinkType, setAddTaskLinkType] = useState('ASSOCIATED');

    async function getTaskLinks() {
        try {
            if (taskCode) {
                let response = await TaskClient.getTaskLinks(taskCode);
                setTaskLinks(response.data);
            }
        } catch (error) {
            console.log("Cannot get task comments, reason: " + error)
        }
    }

    async function getTaskLinkTypes() {
        let types = await ReferenceService.getTaskLinkTypes();
        setTaskLinkTypes(types);
    }

    useEffect(() => {
        getTaskLinks();
        getTaskLinkTypes();
    }, []);

    function openAddLink() {
        setIsAddLink(true);
    }

    async function closeAddLink(task) {
        if (task.taskCode && addTaskLinkType) {
            let connectedTaskCode = task.taskCode;
            await TaskClient.createTaskLink(taskCode, connectedTaskCode, addTaskLinkType);
            await getTaskLinks();
            setIsAddLink(false);
        }
    }

    function onChangeAddTaskLinkType(key) {
        if (key) {
            setAddTaskLinkType(key);
        }
    }

    async function onDeleteTaskLink(link) {
        await getTaskLinks();
    }

    return (
        <div className={"task-links"}>
            <div className={"task-links-header"}>
                <h3>Связанные задачи</h3>
                <div className={"task-links-add"}
                     onClick={openAddLink}>
                    <svg viewBox="0 0 22 22"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17H10V12H5V10H10V5H12V10H17V12H12Z" />
                    </svg> <span>Добавить</span>
                </div>
            </div>
            {taskLinks.length > 0 &&
                <div className={"task-link-list"}>
                    {taskLinks.map((taskLink, i) => {
                        return (
                            <TaskLink taskCode={taskCode}
                                      key={taskLink?.id}
                                      link={taskLink}
                                      taskLinkTypes={taskLinkTypes}
                                      onDelete={onDeleteTaskLink} />
                        );
                    })}
                </div>}
            {taskLinks.length === 0 && !isAddLink &&
                <div className={"task-links-empty"}>Связанных задач пока нет</div>}
            {isAddLink &&
                <div className={"add-task-form"}>
                    <div className={"task-link-type-select"}>
                        <SelectBox values={taskLinkTypes}
                                   selectedKey={addTaskLinkType}
                                   name={"task-link-type"}
                                   onChange={onChangeAddTaskLinkType} />
                    </div>
                    <div className={"task-link-add-input"}>
                        <TaskAutocomplete id={"task-autocomplete"}
                                          onChange={closeAddLink}/>
                    </div>
                </div>}
        </div>
    );
}

export default TaskLinks;
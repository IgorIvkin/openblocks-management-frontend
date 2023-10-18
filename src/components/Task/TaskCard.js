import './TaskCard.css'
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import TaskClient from "../../clients/TaskClient";
import ReferenceService from "../../service/ReferenceService";
import TaskType from "../Backlog/TaskType";
import SelectBox from "../Input/SelectBox";
import TaskPriority from "../Backlog/TaskPriority";

function TaskCard() {

    const {taskCode} = useParams();
    let [task, setTask] = useState({});
    let [statuses, setStatuses] = useState([]);
    let [priorities, setPriorities] = useState([]);

    let [isEditStatus, setIsEditStatus] = useState(false)
    let [isEditPriority, setIsEditPriority] = useState(false)
    let [isEditExplanation, setIsEditExplanation] = useState(false)

    async function getTask() {
        try {
            let response = await TaskClient.getTask(taskCode);
            setTask(response.data);
        } catch (error) {
            console.log("Cannot get task, reason: " + error)
        }
    }

    async function getStatuses() {
        let statuses = await ReferenceService.getStatuses();
        setStatuses(statuses);
    }

    async function getPriorities() {
        let priorities = await ReferenceService.getPriorities();
        setPriorities(priorities);
    }

    function openEditStatus() {
        setIsEditStatus(true);
    }

    function closeEditStatus(key) {
        task.status = key;
        setTask(task);
        setIsEditStatus(false);
    }

    function openEditPriority() {
        setIsEditPriority(true);
    }

    function closeEditPriority(key) {
        task.priority = key;
        setTask(task);
        setIsEditPriority(false);
    }

    function openEditExplanation() {
        setIsEditExplanation(true);
    }

    function closeEditExplanation(event) {
        let explanation = event.target.value;
        if (explanation && explanation !== '') {
            let oldExplanation = task.explanation;
            if (oldExplanation !== explanation) {
                task.explanation = explanation;
                setTask(task);
            }
        }
        setIsEditExplanation(false);
    }

    useEffect(() => {
        getTask()
        getStatuses()
        getPriorities()
    }, []);

    return (
        <div className={"task-card"}>
            <div className={"main-block"}>
                <div className={"task-breadcrumbs"}>
                    <a href={"/backlog"}>Все задачи по {task?.project?.title}</a>
                </div>
                <div className={"task-header"}>
                    <div className={"task-type"}>
                        <TaskType type={task.taskType}/>
                    </div>
                    <div className={"task-code"}>
                        <a href={"#"}>{task.code}</a>
                    </div>
                    <h2>{task.subject}</h2>
                </div>

                <div className={"task-main-params"}>
                    <div className={"task-param"}>
                        <div className={"task-param-name"}>Статус задачи</div>
                        {!isEditStatus &&
                            <div className={"task-param-value"}
                                 onClick={openEditStatus}>{statuses[task.status]}</div>
                        }
                        {isEditStatus &&
                            <SelectBox values={statuses}
                                       autoFocus={true}
                                       selectedKey={task.status}
                                       name={"task-status"}
                                       onChange={closeEditStatus}/>
                        }
                    </div>
                    <div className={"task-param"}>
                        <div className={"task-param-name"}>Приоритет</div>
                        {!isEditPriority &&
                            <div className={"task-param-value"}
                                 onClick={openEditPriority}>
                                <TaskPriority priority={task.priority}/> {priorities[task.priority]}
                            </div>
                        }
                        {isEditPriority &&
                            <SelectBox values={priorities}
                                       autoFocus={true}
                                       selectedKey={task.priority}
                                       name={"task-priority"}
                                       onChange={closeEditPriority}/>}
                    </div>
                </div>

                <div className={"task-explanation"}>
                    <div className={"task-explanation-block"}>
                        <h3>Описание задачи</h3>
                        {!isEditExplanation &&
                            <div className={"task-explanation-text"}
                                 onClick={openEditExplanation}>{task.explanation}</div>}
                        {isEditExplanation &&
                            <div className={""}>
                                <textarea style={{height: "150px"}}
                                          autoFocus={true}
                                          defaultValue={task.explanation}
                                          onBlur={closeEditExplanation}/>
                            </div>}
                    </div>
                </div>
            </div>
            <div className={"details-block"}>

            </div>
        </div>
    );

}

export default TaskCard;
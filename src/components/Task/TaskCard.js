import './TaskCard.css'
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import TaskClient from "../../clients/TaskClient";
import ReferenceService from "../../service/ReferenceService";
import TaskType from "../Backlog/TaskType";
import SelectBox from "../Input/SelectBox";
import TaskPriority from "../Backlog/TaskPriority";
import TaskStatus from "../Backlog/TaskStatus";
import TaskUtilService from "../../service/TaskUtilService";
import Datepicker from "../Input/Datepicker";
import Autocomplete from "../Input/Autocomplete";
import UserAutocomplete from "./UserAutocomplete";

function TaskCard() {

    const {taskCode} = useParams();
    let [task, setTask] = useState({});
    let [statuses, setStatuses] = useState([]);
    let [priorities, setPriorities] = useState([]);

    let [isEditStatus, setIsEditStatus] = useState(false);
    let [isEditPriority, setIsEditPriority] = useState(false);
    let [isEditExplanation, setIsEditExplanation] = useState(false);
    let [isEditDueDate, setIsEditDueDate] = useState(false);
    let [isEditOwner, setIsEditOwner] = useState(false);
    let [isEditExecutor, setIsEditExecutor] = useState(false);

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

    function openEditDueDate(event) {
        event.stopPropagation();
        setIsEditDueDate(true);
    }

    function closeEditDueDate(date) {
        if (task.dueDate !== date) {
            task.dueDate = date;
            setTask(task);
        }
        setIsEditDueDate(false);
    }

    function openEditOwner() {
        setIsEditOwner(true);
    }

    function closeEditOwner(owner) {
        if (task?.owner?.id !== owner.id) {
            task["owner"]["id"] = owner.id;
            task["owner"]["shortName"] = owner.shortName;
            task["owner"]["name"] = owner.name;
            setTask(task);
        }
        setIsEditOwner(false);
    }

    function openEditExecutor() {
        setIsEditExecutor(true);
    }

    function closeEditExecutor(executor) {
        if (task?.executor?.id !== executor.id) {
            task["executor"]["id"] = executor.id;
            task["executor"]["shortName"] = executor.shortName;
            task["executor"]["name"] = executor.name;
            setTask(task);
        }
        setIsEditExecutor(false);
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
                                 onClick={openEditStatus}><TaskStatus status={task.status}/></div>
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
                <div className={"details-item"}>
                    <div className={"details-item-name"}>Владелец задачи</div>
                    <div className={"details-item-value"}>
                        {!isEditOwner &&
                            <div onClick={openEditOwner}>
                                {task?.owner?.name &&
                                    <span>
                                    <span className={"existing-user"}>{task?.owner?.shortName}</span>
                                        {task?.owner?.name}
                                </span>}
                                {!task?.owner?.name && <span>-</span>}
                            </div>}
                        {isEditOwner &&
                            <UserAutocomplete id={"owner-autocomplete"}
                                              onChange={closeEditOwner} />}
                    </div>
                </div>
                <div className={"details-item"}>
                    <div className={"details-item-name"}>Исполнитель</div>
                    <div className={"details-item-value"}>
                        {!isEditExecutor &&
                            <div onClick={openEditExecutor}>
                                {task?.executor?.name &&
                                    <span>
                                    <span className={"existing-user"}>{task?.executor?.shortName}</span>
                                        {task?.executor?.name}
                                </span>}
                                {!task?.executor?.name && <span>-</span>}
                            </div>}
                        {isEditExecutor &&
                            <UserAutocomplete id={"executor-autocomplete"}
                                              onChange={closeEditExecutor} />}
                    </div>
                </div>
                <div className={"details-item"}>
                    <div className={"details-item-name"}>Срок исполнения</div>
                    <div className={"details-item-value"}>
                        {isEditDueDate &&
                            <Datepicker id={"due-date-datepicker"}
                                        selectedDate={task.dueDate}
                                        onChange={closeEditDueDate}/>}
                        {!isEditDueDate &&
                            <span className={"task-due-date"}
                                  onClick={openEditDueDate}>{TaskUtilService.getLocalDateByIsoDate(task.dueDate)}</span>}
                    </div>
                </div>
                <div className={"details-item"}>
                    <div className={"details-item-name"}>Оценка</div>
                    <div className={"details-item-value"}>{TaskUtilService.getEstimation(task.estimation)}</div>
                </div>
                <div className={"details-item"}>
                    <div className={"details-item-name"}>Дата создания задачи</div>
                    <div
                        className={"details-item-value"}>{TaskUtilService.getLocalDateTimeByIsoDateTime(task.createdAt)}</div>
                </div>
                <div className={"details-item"}>
                    <div className={"details-item-name"}>Дата последнего обновления</div>
                    <div
                        className={"details-item-value"}>{TaskUtilService.getLocalDateTimeByIsoDateTime(task.updatedAt)}</div>
                </div>
            </div>
        </div>
    );

}

export default TaskCard;
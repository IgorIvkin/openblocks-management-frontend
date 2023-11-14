import './TaskCard.css'
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import TaskClient from "../../clients/TaskClient";
import SprintClient from "../../clients/SprintClient";
import ReferenceService from "../../service/ReferenceService";
import TaskType from "../Backlog/TaskType";
import SelectBox from "../Input/SelectBox";
import TaskPriority from "../Backlog/TaskPriority";
import TaskStatus from "../Backlog/TaskStatus";
import TaskUtilService from "../../service/TaskUtilService";
import Datepicker from "../Input/Datepicker";
import UserAutocomplete from "./UserAutocomplete";
import TaskExplanation from "./TaskExplanation";
import TaskComments from "./Comments/TaskComments";
import TaskLinks from "./TaskLink/TaskLinks";
import TaskSprint from "./TaskSprint";
import TaskFiles from "./Files/TaskFiles";
import TaskTopButtons from "./TaskTopButtons";
import TaskHistory from "./History/TaskHistory";
import RichTextEditor from "../Input/RichTextEditor/RichTextEditor";

const TaskCard = observer(({errorStore}) => {

    const {taskCode} = useParams();
    let [task, setTask] = useState({});
    let [statuses, setStatuses] = useState([]);
    let [priorities, setPriorities] = useState([]);
    let [sprints, setSprints] = useState([]);

    let [isEditStatus, setIsEditStatus] = useState(false);
    let [isEditPriority, setIsEditPriority] = useState(false);
    let [isEditExplanation, setIsEditExplanation] = useState(false);
    let [isEditDueDate, setIsEditDueDate] = useState(false);
    let [isEditOwner, setIsEditOwner] = useState(false);
    let [isEditExecutor, setIsEditExecutor] = useState(false);
    let [isEditEstimation, setIsEditEstimation] = useState(false);
    let [isEditSubject, setIsEditSubject] = useState(false);
    let [isEditSprint, setIsEditSprint] = useState(false);

    async function getTask() {
        try {
            let response = await TaskClient.getTask(taskCode);
            setTask(response.data);
            await getSprints(response.data?.project?.code);
        } catch (error) {
            handleTaskError(error, "Не получилось загрузить данные по задаче " + taskCode)
        }
    }

    async function getStatuses() {
        let statuses = await ReferenceService.getStatuses();
        if (statuses) {
            setStatuses(statuses);
        }
    }

    async function getPriorities() {
        let priorities = await ReferenceService.getPriorities();
        if (priorities) {
            setPriorities(priorities);
        }
    }

    async function getSprints(projectCode) {
        let unfinishedSprints = await SprintClient.getAllUnfinished(projectCode);
        let sprints = [];
        unfinishedSprints.data.forEach((sprint) => {
            sprints[sprint.id] = sprint.title;
        });
        sprints["-"] = "Не задан";
        setSprints(sprints);
    }

    function openEditStatus() {
        setIsEditStatus(true);
    }

    async function closeEditStatus(key) {
        if (task.status !== key) {
            task.status = key;
            setTask(task);
            await TaskClient.updateTaskStatus(task.code, key);
        }
        setIsEditStatus(false);
    }

    function openEditPriority() {
        setIsEditPriority(true);
    }

    async function closeEditPriority(key) {
        if (task.priority !== key) {
            task.priority = key;
            setTask(task);
            await TaskClient.updateTaskPriority(task.code, key);
        }
        setIsEditPriority(false);
    }

    function openEditSprint() {
        setIsEditSprint(true);
    }

    async function closeEditSprint(sprintId) {
        if (task?.sprint?.id?.toString() !== sprintId.toString()) {
            task["sprint"]  = {
                id: sprintId,
                title: sprints[sprintId]
            }
            setTask(task);
            await TaskClient.updateTaskSprint(task.code, sprintId);
        }
        setIsEditSprint(false);
    }

    function openEditExplanation() {
        setIsEditExplanation(true);
    }

    async function closeEditExplanation(event) {
        let explanation = event.target.value;
        if (explanation && explanation !== '') {
            let oldExplanation = task.explanation;
            if (oldExplanation !== explanation) {
                task.explanation = explanation;
                setTask(task);
                await TaskClient.updateTaskExplanation(task.code, explanation);
            }
        }
        setIsEditExplanation(false);
    }

    async function onChangeEditorExplanation(explanation) {
        if (explanation && explanation !== '') {
            let oldExplanation = task.explanation;
            if (oldExplanation !== explanation) {
                task.explanation = explanation;
                setTask(task);
                await TaskClient.updateTaskExplanation(task.code, explanation);
            }
        }
        setIsEditExplanation(false);
    }

    function openEditEstimation() {
        setIsEditEstimation(true);
    }

    async function closeEditEstimation(event) {
        let estimation = event.target.value;
        if (estimation && estimation !== '') {
            let oldEstimation = task.estimation;
            if (oldEstimation !== estimation) {
                task.estimation = estimation;
                setTask(task);
                await TaskClient.updateTaskEstimation(task.code, estimation);
            }
        }
        setIsEditEstimation(false);
    }

    function openEditDueDate(event) {
        event.stopPropagation();
        setIsEditDueDate(true);
    }

    async function closeEditDueDate(dateTime) {

        function toIsoDate(date) {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        }

        if (task.dueDate !== dateTime) {
            const isoDate = dateTime ? toIsoDate(dateTime) : null;
            task.dueDate = isoDate;
            setTask(task);
            await TaskClient.updateTaskDueDate(task.code, isoDate);
        }
        setIsEditDueDate(false);
    }

    function openEditOwner() {
        setIsEditOwner(true);
    }

    async function closeEditOwner(owner) {
        if (task?.owner?.id !== owner.id) {
            if (!task.owner) {
                task["owner"] = {};
            }
            task["owner"]["id"] = owner.id;
            task["owner"]["shortName"] = owner.shortName;
            task["owner"]["name"] = owner.name;
            setTask(task);
            await TaskClient.updateTaskOwner(task.code, owner.id);
        }
        setIsEditOwner(false);
    }

    function openEditExecutor() {
        setIsEditExecutor(true);
    }

    async function closeEditExecutor(executor) {
        if (task?.executor?.id !== executor.id) {
            if (!task.executor) {
                task["executor"] = {};
            }
            task["executor"]["id"] = executor.id;
            task["executor"]["shortName"] = executor.shortName;
            task["executor"]["name"] = executor.name;
            setTask(task);
            await TaskClient.updateTaskExecutor(task.code, executor.id);
        }
        setIsEditExecutor(false);
    }

    function openEditSubject() {
        setIsEditSubject(true);
    }

    async function closeEditSubject(event) {
        let subject = event.target.value;
        if (subject && subject !== '') {
            if (subject !== task.subject) {
                task.subject = subject;
                setTask(task);
                await TaskClient.updateTaskSubject(task.code, subject);
            }
        }
        setIsEditSubject(false);
    }

    function onKeyDownSubject(event) {
        event.stopPropagation();
        if (event.key === 'Enter') {
            event.target.blur();
        }
    }

    function handleTaskError(error, strErrorMessage) {
        let techDetails;
        if (error.response) {
            techDetails = '[' + error.response.data.errorCode + '] ' + error.response.data.message;
        } else {
            techDetails = error.message;
        }
        errorStore.setError({
            message: strErrorMessage,
            techDetails: techDetails,
            errorObject: error
        });
    }

    useEffect(() => {
        getTask();
        getStatuses();
        getPriorities();
    }, []);

    return (
        <div className={"task-card"}>
            <div className={"main-block"}>

                <TaskTopButtons taskCode={taskCode} task={task} />

                <div className={"task-header"}>
                    <div className={"task-type"}>
                        <TaskType type={task.taskType}/>
                    </div>
                    <div className={"task-code"}>
                        <a href={"#"}>{task.code}</a>
                    </div>
                    <h2>
                        {isEditSubject &&
                            <input type={"text"}
                                   style={{width: "100%"}}
                                   autoFocus={true}
                                   defaultValue={task.subject}
                                   onBlur={closeEditSubject}
                                   onKeyDown={onKeyDownSubject} />}
                        {!isEditSubject &&
                            <div onClick={openEditSubject}
                                 className={"editable-span"}>{task.subject}</div>}
                    </h2>
                </div>

                <div className={"task-main-params"}>
                    <div className={"task-param"}>
                        <div className={"task-param-name"}>Статус задачи</div>
                        {!isEditStatus &&
                            <div className={"task-param-value editable-value"}
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
                            <div className={"task-param-value editable-value"}
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

                    <div className={"task-param"}>
                        <div className={"task-param-name"}>Спринт</div>
                        {!isEditSprint &&
                            <div className={"task-param-value editable-value"}
                                 onClick={openEditSprint}>
                                <TaskSprint sprint={task?.sprint} />
                            </div>
                        }
                        {isEditSprint &&
                            <SelectBox values={sprints}
                                       autoFocus={true}
                                       selectedKey={task?.sprint?.id ? task?.sprint?.id : "-"}
                                       name={"task-sprint"}
                                       onChange={closeEditSprint} />}
                    </div>
                </div>


                <div className={"task-explanation"}>
                    <div className={"task-explanation-block"}>
                        <h3>Описание задачи</h3>
                        {!isEditExplanation &&
                            <div className={"task-explanation-text"}
                                 onClick={openEditExplanation}>
                                <TaskExplanation explanation={task.explanation} />
                            </div>}
                        {isEditExplanation &&
                            <RichTextEditor initialValue={task.explanation}
                                            onChange={onChangeEditorExplanation} />}
                    </div>
                </div>

                <TaskLinks taskCode={taskCode} />

                <TaskFiles taskCode={taskCode} />

                <TaskComments taskCode={taskCode} />

                <TaskHistory taskCode={taskCode} />

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
                                              autoFocus={true}
                                              onChange={closeEditOwner}/>}
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
                                              autoFocus={true}
                                              onChange={closeEditExecutor}/>}
                    </div>
                </div>
                <div className={"details-item"}>
                    <div className={"details-item-name"}>Срок исполнения</div>
                    <div className={"details-item-value"}>
                        {isEditDueDate &&
                            <Datepicker id={"due-date-datepicker"}
                                        selectedDate={task.dueDate}
                                        autoFocus={true}
                                        autoOpen={true}
                                        onChange={closeEditDueDate}/>}
                        {!isEditDueDate &&
                            <span className={"editable-span"}
                                  onClick={openEditDueDate}>{TaskUtilService.getLocalDateByIsoDate(task.dueDate)}</span>}
                    </div>
                </div>
                <div className={"details-item"}>
                    <div className={"details-item-name"}>Оценка (в днях)</div>
                    <div className={"details-item-value"}>
                        {isEditEstimation &&
                            <div>
                                <input type={"text"}
                                       autoFocus={true}
                                       defaultValue={task.estimation}
                                       onBlur={closeEditEstimation}/>
                            </div>}
                        {!isEditEstimation &&
                            <span className={"editable-span"}
                                  onClick={openEditEstimation}>
                                {TaskUtilService.getEstimation(task.estimation)}
                            </span>}
                    </div>
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
});

export default TaskCard;
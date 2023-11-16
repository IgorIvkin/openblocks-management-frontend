import './AddTaskForm.css';
import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import TaskClient from "../../../clients/TaskClient";
import ReferenceService from "../../../service/ReferenceService";
import SprintClient from "../../../clients/SprintClient";
import SelectBox from "../../Input/SelectBox";
import UserAutocomplete from "../UserAutocomplete";
import Datepicker from "../../Input/Datepicker";
import RichTextEditor from "../../Input/RichTextEditor/RichTextEditor";

function AddTaskForm() {

    const navigate = useNavigate();

    const {projectCode} = useParams();

    let [statuses, setStatuses] = useState([]);
    let [priorities, setPriorities] = useState([]);
    let [types, setTypes] = useState([]);
    let [sprints, setSprints] = useState([]);

    let [taskType, setTaskType] = useState("TASK");
    let [taskPriority, setTaskPriority] = useState("MEDIUM");
    let [sprintId, setSprintId] = useState("-");
    let [subject, setSubject] = useState('');
    let [explanation, setExplanation] = useState('');
    let [executor, setExecutor] = useState(null);
    let [dueDate, setDueDate] = useState(null);
    let [estimation, setEstimation] = useState(null);

    let [subjectErrorStatus, setSubjectErrorStatus] = useState(false);
    let [explanationErrorStatus, setExplanationErrorStatus] = useState(false);

    async function getSprints() {
        try {
            let sprints = [];
            if (projectCode) {
                let unfinishedSprints = await SprintClient.getAllUnfinished(projectCode);
                unfinishedSprints.data.forEach((sprint) => {
                    sprints[sprint.id] = sprint.title;
                });
            }
            sprints["-"] = "Не задан";
            setSprints(sprints);
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

    async function getTypes() {
        let types = await ReferenceService.getTypes();
        setTypes(types);
    }

    useEffect(() => {
        getSprints();
        getStatuses();
        getTypes();
        getPriorities();
    }, []);

    function onChangeTaskType(type) {
        if (taskType !== type) {
            setTaskType(type);
        }
    }

    function onChangeTaskPriority(priority) {
        if (taskPriority !== priority) {
            setTaskPriority(priority);
        }
    }

    function onChangeSprintId(id) {
        if (sprintId !== id) {
            setSprintId(id);
        }
    }

    function onChangeSubject(event) {
        setSubjectErrorStatus(false);
        let value = event.target.value;
        setSubject(value);
    }

    function onChangeExplanationRichEditor(value) {
        setExplanationErrorStatus(false);
        setExplanation(value);
    }

    function onChangeEstimation(event) {
        let value = event.target.value;
        setEstimation(value);
    }

    function onChangeDueDate(dateValue) {
        if (dateValue !== dueDate) {
            setDueDate(dateValue);
        }
    }

    function getSubjectErrorStatus() {
        return subjectErrorStatus ? "input-error" : "";
    }

    function getExplanationErrorStatus() {
        return explanationErrorStatus ? "input-rich-edit-error" : "";
    }

    async function onClickAddTask() {

        function toIsoDate(date) {
            if (date) {
                return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            }
            return null;
        }

        function toNumeric(value) {
            if (value && value !== '-') {
                return parseInt(value);
            }
            return null;
        }

        if (!subject || subject === '') {
            setSubjectErrorStatus(true);
        }
        if (!explanation || explanation === '') {
            setExplanationErrorStatus(true);
        }

        if (subject && subject !== '' && explanation && explanation !== '') {
            let response = await TaskClient.createTask(projectCode, {
                subject: subject,
                explanation: explanation,
                taskType: taskType,
                priority: taskPriority,
                executorId: executor?.id,
                estimation: toNumeric(estimation),
                dueDate: toIsoDate(dueDate),
                sprintId: toNumeric(sprintId),
            });
            if (response.data) {
                navigate("/tasks/view/" + response.data.id);
            }
        }
    }

    return (
        <div className={"create-task-form"}>

            {projectCode &&
                <h1>Добавить задачу в проект {projectCode}</h1>}
            {!projectCode &&
                <h1>Добавить задачу</h1>}

            <div className={"add-task-parameters"}>
                <div className={"add-task-parameter"}>
                    <div className={"add-task-param-name"}>Тип задачи</div>
                    <div className={"add-task-param-value"}>
                        <SelectBox values={types}
                                   selectedKey={"TASK"}
                                   name={"task-type"}
                                   onChange={onChangeTaskType} />
                    </div>
                </div>

                <div className={"add-task-parameter"}>
                    <div className={"add-task-param-name"}>Приоритет</div>
                    <div className={"add-task-param-value"}>
                        <SelectBox values={priorities}
                                   selectedKey={"MEDIUM"}
                                   name={"task-priority"}
                                   onChange={onChangeTaskPriority} />
                    </div>
                </div>

                <div className={"add-task-parameter"}>
                    <div className={"add-task-param-name"}>Спринт</div>
                    <div className={"add-task-param-value"}>
                        <SelectBox values={sprints}
                                   selectedKey={"-"}
                                   name={"task-sprint"}
                                   onChange={onChangeSprintId} />
                    </div>
                </div>
            </div>

            <div className={"add-task-main-info"}>
                <div className={"add-task-subject add-task-item"}>
                    <input type={"text"}
                           value={subject}
                           className={getSubjectErrorStatus()}
                           placeholder={"Введите название задачи"}
                           onChange={onChangeSubject}/>
                </div>
                <div className={"add-task-explanation add-task-item"}>
                    <RichTextEditor autoFocus={false}
                                    className={getExplanationErrorStatus()}
                                    onChange={onChangeExplanationRichEditor} />
                </div>
            </div>

            <div className={"add-task-parameters"}>
                <div className={"add-task-parameter"}>
                    <div className={"add-task-param-name"}>Исполнитель</div>
                    <div className={"add-task-param-value"}>
                        <UserAutocomplete id={"owner-autocomplete"}
                                          autoFocus={false}
                                          onChange={(item, autoCompleteRef) => {
                                              if (autoCompleteRef) {
                                                  autoCompleteRef.current.value = item?.name;
                                              }
                                              setExecutor(item);
                                          }} />
                    </div>
                </div>

                <div className={"add-task-parameter"}>
                    <div className={"add-task-param-name"}>Оценка (в днях)</div>
                    <div className={"add-task-param-value"}>
                        <input type={"text"}
                               value={estimation}
                               placeholder={"Например, 5"}
                               onChange={onChangeEstimation} />
                    </div>
                </div>

                <div className={"add-task-parameter"}>
                    <div className={"add-task-param-name"}>Срок исполнения</div>
                    <div className={"add-task-param-value"}>
                        <Datepicker id={"due-date-datepicker"}
                                    autoFocus={false}
                                    autoOpen={false}
                                    onChange={onChangeDueDate} />
                    </div>
                </div>

            </div>

            <div className={"add-task-buttons"}>
                <button className={"btn-add"}
                        onClick={onClickAddTask}>Создать задачу</button>
            </div>

        </div>
    );
}

export default AddTaskForm;
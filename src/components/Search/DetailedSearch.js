import './DetailedSearch.css';
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ProjectClient from "../../clients/ProjectClient";
import SelectBox from "../Input/SelectBox";
import SprintClient from "../../clients/SprintClient";
import ReferenceService from "../../service/ReferenceService";
import BacklogClient from "../../clients/BacklogClient";
import UserAutocomplete from "../Task/UserAutocomplete";
import Datepicker from "../Input/Datepicker";
import TaskUtilService from "../../service/TaskUtilService";
import DetailedSearchTask from "./DetailedSearchTask";

function DetailedSearch() {

    let {projectCode = ''} = useParams();

    let [projects, setProjects] = useState([]);
    let [sprints, setSprints] = useState([]);
    let [tasks, setTasks] = useState([]);
    let [statuses, setStatuses] = useState([]);
    let [types, setTypes] = useState([]);

    let [filterProjectCode, setFilterProjectCode] = useState(projectCode !== '' ? projectCode : "-");
    let [filterSprintId, setFilterSprintId] = useState("-");
    let [filterStatus, setFilterStatus] = useState("-");
    let [filterType, setFilterType] = useState("-");
    let [filterSubject, setFilterSubject] = useState("");
    let [filterExecutor, setFilterExecutor] = useState(null);
    let [filterOwner, setFilterOwner] = useState(null);
    let [filterDateFrom, setFilterDateFrom] = useState(null);
    let [filterDateTo, setFilterDateTo] = useState(null);

    let [filterProjectErrorStatus, setFilterProjectErrorStatus] = useState(false);

    async function getAllProjects() {
        let response = await ProjectClient.getAllProjects()
        let allProjects = [];
        response.data.forEach((project) => {
            allProjects[project.code] = project.title;
        })
        allProjects["-"] = "Проект не выбран";
        setProjects(allProjects);
    }

    async function getAllSprints(projectCode) {
        let allSprints = [];
        if (projectCode && projectCode !== "-") {
            let response = await SprintClient.getAllSprints(projectCode);
            response.data.forEach((sprint) => {
                allSprints[sprint.id] = sprint.title;
            });
        }
        allSprints["-"] = "Все спринты";
        setSprints(allSprints);
    }

    async function getStatuses() {
        let statuses = await ReferenceService.getStatuses();
        statuses["-"] = "Все статусы";
        setStatuses(statuses);
    }

    async function getTypes() {
        let types = await ReferenceService.getTypes();
        types["-"] = "Все типы";
        setTypes(types);
    }

    async function onChangeProjectFilter(code) {
        if (code !== '' && code !== filterProjectCode) {
            await getAllSprints(code);
        }
        setFilterProjectErrorStatus(false);
        setFilterProjectCode(code);
    }

    function onChangeSprintFilter(sprintId) {
        setFilterSprintId(sprintId);
    }

    function onChangeStatusFilter(key) {
        setFilterStatus(key);
    }

    function onChangeTypeFilter(key) {
        setFilterType(key);
    }

    function onChangeSubjectFilter(event) {
        let value = event.target.value;
        setFilterSubject(value);
    }

    function onChangeDateFrom(dateValue) {
        if (dateValue !== filterDateFrom) {
            setFilterDateFrom(dateValue);
        }
    }

    function onChangeDateTo(dateValue) {
        if (dateValue !== filterDateTo) {
            setFilterDateTo(dateValue);
        }
    }

    async function onClickSearch() {
        if (filterProjectCode && filterProjectCode !== "-") {
            let backlogResponse = await BacklogClient.getBacklog({
                projectCode: filterProjectCode && filterProjectCode !== "-" ? filterProjectCode : null,
                sprints: filterSprintId && filterSprintId !== "-" ? [parseInt(filterSprintId)] : null,
                taskTypes: filterType && filterType !== "-" ? [filterType] : null,
                statuses: filterStatus && filterStatus !== "-" ? [filterStatus] : null,
                subject: filterSubject !== "" ? filterSubject : null,
                executorId: filterExecutor?.name ? filterExecutor?.id : null,
                ownerId: filterOwner?.name ? filterOwner?.id : null,
                dateFrom: TaskUtilService.getIsoDateByLocalDate(filterDateFrom),
                dateTo: TaskUtilService.getIsoDateByLocalDate(filterDateTo),
            });
            setTasks(backlogResponse.data);
        } else {
            setFilterProjectErrorStatus(true);
        }
    }

    async function initializeDetailedSearch() {
        await Promise.all([
            getAllProjects(),
            getAllSprints(projectCode),
            getStatuses(),
            getTypes()
        ]);
        if (projectCode && projectCode !== '-') {
            await onClickSearch();
        }
    }

    useEffect(() => {
        initializeDetailedSearch();
    }, []);

    return (
        <div className={"detailed-search generic-backlog"}>
            <div className={"detailed-search-filters"}>

                <div className={"detailed-search-main-filters"}>

                    <div className={"detailed-search-project"}>
                        <label>Проект</label>
                        <SelectBox values={projects}
                                   overflow={true}
                                   selectedKey={projectCode !== '' ? projectCode : "-"}
                                   name={"filter-projects"}
                                   classes={filterProjectErrorStatus ? "input-error" : ""}
                                   onChange={onChangeProjectFilter}/>
                    </div>

                    <div className={"detailed-search-sprint"}>
                        <label>Спринт</label>
                        <SelectBox values={sprints}
                                   overflow={true}
                                   selectedKey={"-"}
                                   name={"filter-sprints"}
                                   onChange={onChangeSprintFilter}/>
                    </div>

                    <div className={"detailed-search-type"}>
                        <label>Тип задачи</label>
                        <SelectBox values={types}
                                   overflow={true}
                                   selectedKey={"-"}
                                   name={"filter-types"}
                                   onChange={onChangeTypeFilter}/>
                    </div>

                    <div className={"detailed-search-sprint"}>
                        <label>Статус задачи</label>
                        <SelectBox values={statuses}
                                   overflow={true}
                                   selectedKey={"-"}
                                   name={"filter-statuses"}
                                   onChange={onChangeStatusFilter}/>
                    </div>

                    <div className={"detailed-search-subject"}>
                        <label>Название</label>
                        <div className={"input-box"}>
                            <input type={"text"}
                                   value={filterSubject}
                                   onChange={onChangeSubjectFilter}
                                   placeholder={"Название задачи или его часть"}/>
                        </div>
                    </div>
                </div>

                <div className={"detailed-search-secondary-filters"}>

                    <div className={"detailed-search-owner"}>
                        <label>Владелец</label>
                        <UserAutocomplete id={"owner-autocomplete"}
                                          autoFocus={false}
                                          onChange={(item, setAutocompleteValue) => {
                                              if (setAutocompleteValue) {
                                                  setAutocompleteValue(item?.name);
                                              }
                                              setFilterOwner(item);
                                          }}/>
                    </div>

                    <div className={"detailed-search-executor"}>
                        <label>Исполнитель</label>
                        <UserAutocomplete id={"executor-autocomplete"}
                                          autoFocus={false}
                                          onChange={(item, setAutocompleteValue) => {
                                              if (setAutocompleteValue) {
                                                  setAutocompleteValue(item?.name);
                                              }
                                              setFilterExecutor(item);
                                          }}/>
                    </div>

                    <div className={"detailed-search-date-from"}>
                        <label>Дата создания (от)</label>
                        <Datepicker id={"date-from-datepicker"}
                                    rangeId={1}
                                    autoFocus={false}
                                    autoOpen={false}
                                    onChange={onChangeDateFrom}/>
                    </div>

                    <div className={"detailed-search-date-to"}>
                        <label>Дата создания (до)</label>
                        <Datepicker id={"date-to-datepicker"}
                                    rangeId={1}
                                    autoFocus={false}
                                    autoOpen={false}
                                    onChange={onChangeDateTo}/>
                    </div>

                    <div>
                        <button className={"btn-add"}
                                onClick={onClickSearch}>Найти
                        </button>
                    </div>

                </div>

            </div>

            {(!tasks || tasks.length === 0) &&
                <div className={"empty-task-list"}>
                    Нет задач по выбранным критериям.<br/>
                    Задайте параметры поиска и нажмите кнопку "Найти".
                </div>}

            {tasks && tasks.length > 0 &&
                <div className={"task-list"}>
                    <div className={"task-list-header"}>
                        <div>Задача</div>
                        <div>Оценка</div>
                        <div>Срок</div>
                        <div>Исполнитель</div>
                    </div>
                    {tasks
                        .map((task, i) => {
                            return (
                                <DetailedSearchTask key={task.taskCode}
                                                    index={i}
                                                    taskCode={task.taskCode}
                                                    subject={task.subject}
                                                    type={task.type}
                                                    status={task.status}
                                                    priority={task.priority}
                                                    estimation={task.estimation}
                                                    dueDate={task.dueDate}
                                                    executor={task.executor}/>
                            );
                        })}
                </div>}
        </div>
    );

}

export default DetailedSearch;
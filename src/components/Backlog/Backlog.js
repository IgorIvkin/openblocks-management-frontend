import './Backlog.css'
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BacklogClient from "../../clients/BacklogClient";
import SprintClient from "../../clients/SprintClient";
import ProjectClient from "../../clients/ProjectClient";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import BacklogTask from "./BacklogTask";
import SelectBox from "../Input/SelectBox";
import SprintHeader from "./SprintHeader";

function Backlog() {
    const {projectCode} = useParams();

    const navigate = useNavigate();

    let [sprintLayout, setSprintLayout] = useState([]);
    let [tasks, setTasks] = useState([]);
    let [filteredTasks, setFilteredTasks] = useState([]);
    let [sprintsData, setSprintsData] = useState([]);
    let [sprints, setSprints] = useState([]);
    let [executors, setExecutors] = useState([]);
    let [isProjectAdmin, setIsProjectAdmin] = useState(false);

    let [filterTaskSubject, setFilterTaskSubject] = useState('');
    let [filterSprint, setFilterSprint] = useState('-');
    let [filterExecutor, setFilterExecutor] = useState("-");

    async function getBacklogTasks() {
        try {
            await getIsCurrentUserAdmin();
            let response = await BacklogClient.getBacklog({
                "projectCode": projectCode ? projectCode : null
            })

            let allTasks = response.data;
            setTasks(allTasks);
            getExecutors(allTasks);
        } catch (error) {
            console.log("Cannot get backlog, reason: " + error)
        }
    }

    async function getSprints(projectCode) {
        let sprints = [];
        sprints["-"] = "Спринт не выбран";
        if (projectCode) {
            let unfinishedSprints = await SprintClient.getAllUnfinished(projectCode);
            unfinishedSprints.data.forEach((sprint) => {
                sprints[sprint.id] = sprint.title;
            });
            setSprintsData(unfinishedSprints.data);
            let sprintId = chooseActiveSprint(unfinishedSprints.data)
            setFilterSprint(sprintId);
            await getSprintLayout(sprintId);
        }
        setSprints(sprints);
    }

    async function getSprintLayout(sprintId) {
        if (sprintId !== '-') {
            let response = await SprintClient.getSprintLayout(sprintId);
            setSprintLayout(response.data.sprintLayout);
        }
    }

    async function getIsCurrentUserAdmin() {
        if (projectCode) {
            let response = await ProjectClient.isCurrentUserAdmin(projectCode);
            setIsProjectAdmin(response.data);
        }
        return false;
    }

    function getExecutors(allTasks) {
        let allExecutors = [];
        for (let task of allTasks) {
            if (task?.executor?.id) {
                allExecutors[task?.executor?.id.toString()] = task?.executor?.name;
            }
        }
        allExecutors["-"] = "Все исполнители";
        setExecutors(allExecutors);
    }

    function onFilterSubjectChange(event) {
        const value = event.target.value;
        setFilterTaskSubject(value);
    }

    async function onFilterSprintChange(sprint) {
        setFilterSprint(sprint);
        await getSprintLayout(sprint);
    }

    function onFilterExecutorChange(executor) {
        setFilterExecutor(executor);
    }

    function applyFilterOnTaskItem(task) {

        let filtered = true;

        if (filterTaskSubject !== '') {
            filtered = task.subject
                .toLowerCase()
                .includes(filterTaskSubject.toLowerCase());
        }

        if (projectCode) {
            if (filterSprint !== '-') {
                filtered = filtered && task.sprint?.id?.toString() === filterSprint.toString();
            } else {
                filtered = filtered && !task.sprint?.id;
            }
        }

        if (filterExecutor !== '-') {
            filtered = filtered && task.executor?.id?.toString() === filterExecutor;
        }

        return filtered;
    }

    function chooseActiveSprint(allSprints) {
        if (allSprints) {
            let now = new Date();
            for (let sprint of allSprints) {
                let sprintStart = new Date(sprint?.startDate);
                let sprintEnd = new Date(sprint?.endDate);
                let sprintId = sprint?.id;
                if (now >= sprintStart && now <= sprintEnd) {
                    return sprintId.toString();
                }
            }
        }
        return "-";
    }

    function activeSprintDetails() {
        if (filterSprint && sprintsData) {
            for (let sprint of sprintsData) {
                if (filterSprint.toString() === sprint?.id.toString()) {
                    return sprint;
                }
            }
        }
        return {};
    }

    async function onDragEnd(result) {
        const {destination, source, draggableId} = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId
            && destination.index === source.index) {
            return;
        }

        let sourceItem = filteredTasks[source.index];
        filteredTasks.splice(source.index, 1);
        filteredTasks.splice(destination.index, 0, sourceItem);

        await storeTaskOrder();
    }

    async function storeTaskOrder() {
        let taskOrder = [];
        for (let task of filteredTasks) {
            taskOrder.push(task.taskCode);
        }
        if (projectCode && filterSprint !== '-') {
            await SprintClient.updateSprintLayout(projectCode, filterSprint, taskOrder);
        }
    }

    function onClickAddTask() {
        if (projectCode) {
            navigate("/add-task/" + projectCode);
        } else {
            navigate("/add-task");
        }
    }

    function onClickDetailedSearch() {
        if (projectCode) {
            navigate("/search/" + projectCode);
        } else {
            navigate("/search");
        }
    }

    function onClickProjectAccess() {
        if (projectCode) {
            navigate("/projects/" + projectCode + "/access");
        }
    }

    async function onCloseSprints() {
        await getBacklogTasks();
        await getSprints(projectCode ? projectCode : null);
    }

    function filterAndSortTasks() {
        let items = tasks.filter((task) => applyFilterOnTaskItem(task));
        if (sprintLayout.length > 0) {
            let taskOrder = {};
            sprintLayout.forEach((item, index) => {
                taskOrder[item] = index;
            });

            items = items.sort((left, right) => {
                let leftTaskCode = left.taskCode;
                let rightTaskCode = right.taskCode;
                if (taskOrder[leftTaskCode] < taskOrder[rightTaskCode]) {
                    return -1;
                } else if (taskOrder[leftTaskCode] > taskOrder[rightTaskCode]) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        return items;
    }

    useEffect(() => {
        getBacklogTasks();
        getSprints(projectCode ? projectCode : null);
    }, []);

    useEffect(() => {
        setFilteredTasks(filterAndSortTasks());
    }, [tasks, filterTaskSubject, filterSprint, filterExecutor, sprintLayout]);

    return (
        <div className="generic-backlog">

            <div className={"backlog-header"}>
                {projectCode &&
                    <h1>Задачи проекта {projectCode}</h1>
                }
                {!projectCode &&
                    <h1>Список задач</h1>
                }

                <div className={"backlog-buttons"}>
                    <button className={"btn-add"}
                            onClick={onClickAddTask}>Добавить задачу</button>
                </div>

                <div className={"backlog-detailed-search"}
                     onClick={onClickDetailedSearch}>
                    <svg viewBox="0 0 24 24"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4V10M19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14M19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14M19 14V20M12 4V16M12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16ZM5 8V20M5 8C6.10457 8 7 7.10457 7 6C7 4.89543 6.10457 4 5 4C3.89543 4 3 4.89543 3 6C3 7.10457 3.89543 8 5 8Z"
                              strokeLinecap="round" />
                    </svg>
                    <span>Подробный поиск</span>
                </div>

                {projectCode && isProjectAdmin &&
                    <div className={"backlog-project-access"}
                         onClick={onClickProjectAccess}>
                        <svg viewBox="0 0 24 24"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.3212 10.6852L4 19L6 21M7 16L9 18M20 7.5C20 9.98528 17.9853 12 15.5 12C13.0147 12 11 9.98528 11 7.5C11 5.01472 13.0147 3 15.5 3C17.9853 3 20 5.01472 20 7.5Z"
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                        <span>Доступы к проекту</span>
                    </div>}

            </div>

            <div className={"task-list-filters"}>
                <div className={"task-list-main-filters"}>
                    <div className={"task-list-filter-sprint"}>
                        <SelectBox values={sprints}
                                   name={"task-status"}
                                   selectedKey={filterSprint}
                                   onChange={onFilterSprintChange} />
                    </div>
                    <div className={"task-list-filter-subject"}>
                        <input type={"text"}
                               placeholder={"Введите название задачи для поиска"}
                               value={filterTaskSubject}
                               onChange={onFilterSubjectChange}/>
                    </div>
                    <div className={"task-list-filter-executor"}>
                        <SelectBox values={executors}
                                   overflow={true}
                                   name={"task-executor"}
                                   selectedKey={filterExecutor}
                                   onChange={onFilterExecutorChange} />
                    </div>
                </div>
            </div>

            {filterSprint !== '-' && isProjectAdmin &&
                <SprintHeader projectCode={projectCode}
                              sprintDetails={activeSprintDetails()}
                              onCloseSprint={onCloseSprints} /> }

            <div className={"task-list"}>
                <div className={"task-list-header"}>
                    <div>Задача</div>
                    <div>Оценка</div>
                    <div>Срок</div>
                    <div>Исполнитель</div>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={"task-list"}>
                        {(provided) => (
                            <div ref={provided.innerRef}
                                 {...provided.droppableProps}>
                                {filteredTasks
                                    .filter((task) => applyFilterOnTaskItem(task))
                                    .map((task, i) => {
                                    return (
                                        <BacklogTask key={task.taskCode}
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
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}

export default Backlog;
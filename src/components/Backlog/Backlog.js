import './Backlog.css'
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BacklogClient from "../../clients/BacklogClient";
import SprintClient from "../../clients/SprintClient";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import BacklogTask from "./BacklogTask";
import SelectBox from "../Input/SelectBox";
import {all} from "axios";

function Backlog() {
    const {projectCode} = useParams();

    const navigate = useNavigate();

    let [tasks, setTasks] = useState([]);
    let [sprints, setSprints] = useState([]);
    let [executors, setExecutors] = useState([]);

    let [filterTaskSubject, setFilterTaskSubject] = useState('');
    let [filterSprint, setFilterSprint] = useState('-');
    let [filterExecutor, setFilterExecutor] = useState("-");

    async function getBacklogTasks() {
        try {
            let response = await BacklogClient.getBacklog({
                "projectCode": projectCode ? projectCode : null
            })
            let allTasks = response.data
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
            setFilterSprint(chooseActiveSprint(unfinishedSprints.data));
        }
        setSprints(sprints);
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

    function onFilterSprintChange(sprint) {
        setFilterSprint(sprint);
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

    function onDragEnd(result) {
        const {destination, source, draggableId} = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId
            && destination.index === source.index) {
            return;
        }

        let sourceItem = tasks[source.index];
        tasks.splice(source.index, 1);
        tasks.splice(destination.index, 0, sourceItem);
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

    useEffect(() => {
        getBacklogTasks();
        getSprints(projectCode ? projectCode : null);
    }, []);

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
                                {tasks
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
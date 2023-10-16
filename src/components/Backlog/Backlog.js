import './Backlog.css'
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import BacklogClient from "../../clients/BacklogClient";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import BacklogTask from "./BacklogTask";

function Backlog() {
    const {projectCode} = useParams();
    let [tasks, setTasks] = useState([])

    async function getBacklogTasks() {
        try {
            let response = await BacklogClient.getBacklog({
                "projectCode": projectCode ? projectCode : null
            })
            let allTasks = response.data
            setTasks(allTasks)
        } catch (error) {
            console.log("Cannot get backlog, reason: " + error)
        }
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

    useEffect(() => {
        getBacklogTasks()
    }, []);

    return (
        <div className="generic-backlog">
            {projectCode &&
                <h1>Задачи проекта {projectCode}</h1>
            }
            {!projectCode &&
                <h1>Список задач</h1>
            }

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
                                {tasks.map((task, i) => {
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
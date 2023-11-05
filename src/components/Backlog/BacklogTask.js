import './Backlog.css'
import React, {useState} from "react";
import TaskType from "./TaskType";
import TaskPriority from "./TaskPriority";
import TaskUtilService from "../../service/TaskUtilService";
import {Draggable} from "react-beautiful-dnd";
import TaskStatus from "./TaskStatus";

function BacklogTask({index, taskCode, type, status, estimation, priority, subject, dueDate, executor}) {

    function addStatusClass() {
        if (status === "CLOSED" || status === "REJECTED") {
            return "task-closed";
        }
        return "";
    }

    return (
        <Draggable draggableId={taskCode} index={index}>
            {(provided) => (
                <div className={"task-item"}
                     ref={provided.innerRef}
                     {...provided.draggableProps}>
                    <div className={"task-code"}>{taskCode}</div>
                    <div className={"task-type"}>
                        <TaskType type={type}/>
                    </div>
                    <div className={"task-priority"}>
                        <TaskPriority priority={priority}/>
                    </div>
                    <div className={"task-subject"}
                         {...provided.dragHandleProps}>
                        <a className={addStatusClass()}
                           href={'/tasks/view/' + taskCode}
                           data-task-code={taskCode}>{subject}</a>
                    </div>
                    <div className={"task-status"}><TaskStatus status={status} /></div>
                    <div className={"task-estimation"}>{TaskUtilService.getEstimation(estimation)}</div>
                    <div className={"task-due-date"}>{TaskUtilService.getLocalDateByIsoDate(dueDate)}</div>
                    <div className={"task-executor"} title={executor.name}>
                        {executor.name &&
                            <span className={"existing-user"}>{executor.shortName}</span>}
                        {!executor.name &&
                            <span>-</span>}
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default BacklogTask;
import './Backlog.css'
import React, {useState} from "react";
import TaskType from "./TaskType";
import TaskPriority from "./TaskPriority";
import {Draggable} from "react-beautiful-dnd";

function BacklogTask({index, taskCode, type, status, estimation, priority, subject, dueDate, executor}) {

    function addStatusClass() {
        if (status === "CLOSED") {
            return "task-closed";
        }
        return "";
    }

    function addEstimation() {
        if (estimation) {
            const weeks = Math.floor(estimation / 5);
            const remainderDays = estimation % 5;
            if (weeks < 1) {
                return estimation + 'д';
            } else if (remainderDays > 0) {
                return weeks + 'н ' + remainderDays + 'д';
            } else {
                return weeks + 'н';
            }
        }
        return "-"
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
                    <div className={"task-estimation"}>{addEstimation()}</div>
                    <div className={"task-due-date"}>{dueDate ? dueDate : '-'}</div>
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
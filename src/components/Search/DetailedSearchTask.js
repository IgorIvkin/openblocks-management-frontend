import React from "react";
import TaskType from "../Backlog/TaskType";
import TaskPriority from "../Backlog/TaskPriority";
import TaskStatus from "../Backlog/TaskStatus";
import TaskUtilService from "../../service/TaskUtilService";

function DetailedSearchTask({index, taskCode, type, status, estimation, priority, subject, dueDate, executor}) {

    function addStatusClass() {
        if (status === "CLOSED") {
            return "task-closed";
        }
        return "";
    }

    return (
        <div className={"task-item"}>
            <div className={"task-code"}>{taskCode}</div>
            <div className={"task-type"}>
                <TaskType type={type}/>
            </div>
            <div className={"task-priority"}>
                <TaskPriority priority={priority}/>
            </div>
            <div className={"task-subject"}>
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
    );
}

export default DetailedSearchTask;
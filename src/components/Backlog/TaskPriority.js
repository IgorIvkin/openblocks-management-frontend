import './Backlog.css'
import React from "react";

function TaskPriority({priority}) {

    function renderTaskPriority() {
        if (priority === "LOW") {
            return <span title={"Низкий"} className={"task-priority-low"}>&#129047;</span>
        } else if (priority === "MEDIUM") {
            return <span title={"Средний"} className={"task-priority-medium"}>=</span>
        } else if (priority === "HIGH") {
            return <span title={"Высокий"} className={"task-priority-high"}>&#129045;</span>
        } else if (priority === "CRITICAL") {
            return <span title={"Критический"} className={"task-priority-critical"}>&#8648;</span>
        } else {
            return <span className={"task-priority-medium"}>=</span>
        }
    }

    return (
        renderTaskPriority()
    );
}

export default TaskPriority;
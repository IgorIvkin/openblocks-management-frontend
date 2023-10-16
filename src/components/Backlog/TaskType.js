import React from "react";

function TaskType({type}) {

    function renderTaskType() {
        if (type === "TASK") {
            return <span title={"Задача"} className={"task-type-task"}></span>
        } else if (type === "BUG") {
            return <span title={"Дефект"} className={"task-type-bug"}></span>
        } else if (type === "STORY") {
            return <span title={"История"} className={"task-type-story"}></span>
        } else {
            return <span className={"task-type-task"}></span>
        }
    }

    return (
        renderTaskType()
    );
}

export default TaskType;
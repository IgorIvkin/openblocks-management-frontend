import React from "react";

function TaskSprint({sprint}) {

    function sprintDefined() {
        return sprint?.id;
    }

    return (
        <span>
            {sprintDefined() &&
                <span>
                    {sprint.title}
                </span>}
            {!sprintDefined() &&
                <span>
                    Не задан
                </span>}
        </span>
    );
}

export default TaskSprint;
import React from "react";

function TaskExplanation({explanation}) {

    function prepareExplanation(source) {
        if (source) {
            return source;
        }
        return '';
    }

    return (
        <span dangerouslySetInnerHTML={
            {__html: prepareExplanation(explanation)}
        }/>
    );
}

export default TaskExplanation;
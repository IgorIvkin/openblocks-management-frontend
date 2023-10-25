import React from "react";

function TaskExplanation({explanation}) {

    function prepareExplanation(source) {
        if (source) {
            return source.replaceAll("\n", "<br />")
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
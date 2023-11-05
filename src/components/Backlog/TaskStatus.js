import './TaskStatus.css'
import React from "react";

function TaskStatus({status}) {

    function renderTaskStatus() {
        if (status === 'CREATED') {
            return <span className={"task-status task-status-created"}>Создано</span>
        } else if (status === 'IN_WORK') {
            return <span className={"task-status task-status-in-work"}>В работе</span>
        } else if (status === 'TESTING') {
            return <span className={"task-status task-status-testing"}>Тестирование</span>
        } else if (status === 'CLOSED') {
            return <span className={"task-status task-status-closed"}>Закрыто</span>
        } else if (status === 'REJECTED') {
            return <span className={"task-status task-status-rejected"}>Отклонено</span>
        }
    }

    return (
        renderTaskStatus()
    );

}

export default TaskStatus;
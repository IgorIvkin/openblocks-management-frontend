import './TaskCard.css';
import React, {useState} from "react";
import ModalWindow from "../Modal/ModalWindow";
import TaskClient from "../../clients/TaskClient";

function TaskTopButtons({taskCode, task}) {

    let [isCloneModal, setIsCloneModal] = useState(false);

    function openCloneModal() {
        setIsCloneModal(true);
    }

    return (
        <div className={"task-top-buttons"}>
            {isCloneModal &&
                <ModalWindow header={"Клонирование задачи"}
                             okButtonLabel={"Клонировать"}
                             visible={true}
                             setIsDeleteModal={setIsCloneModal}
                             onClickOk={async () => {
                                 let response = await TaskClient.cloneTask(taskCode);
                                 if (response) {
                                     window.location.href = "/tasks/view/" + response.data.id;
                                 }
                                 setIsCloneModal(false);
                             }}>
                    <div className={"modal-window-question"}>
                        Вы уверены, что хотите клонировать эту задачу?<br /><br />
                        Задача будет скопирована в <u>этот же спринт</u>, будут сохранены название, описание, исполнители,
                        оценка и срок исполнения.
                    </div>
                </ModalWindow>}
            <div className={"task-breadcrumbs"}>
                <a href={"/backlog/" + task?.project?.code}>Все задачи по {task?.project?.title}</a>
            </div>
            <div className={"task-top-button task-top-button-clone"}
                 onClick={openCloneModal}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7,23 L23,23 L23,7 L7,7 L7,23 Z M17,3.9997 L17,0.9997 L14,0.9997 M1,13.9997 L1,16.9997 L4,16.9997 M1,11.9997 L1,5.9997 L1,11.9997 Z M4,0.9997 L1,0.9997 L1,3.9997 M6,0.9997 L12,0.9997 L6,0.9997 Z"/>
                </svg>
                <span>Клонировать</span>
            </div>
        </div>
    );
}

export default TaskTopButtons;
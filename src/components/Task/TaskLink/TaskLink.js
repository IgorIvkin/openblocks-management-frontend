import './TaskLinks.css';
import React, {useState} from "react";
import SelectBox from "../../Input/SelectBox";
import TaskClient from "../../../clients/TaskClient";
import ModalWindow from "../../Modal/ModalWindow";

function TaskLink({taskCode, link, taskLinkTypes, onDelete}) {

    let [isDeleteModal, setIsDeleteModal] = useState(false);

    function openDeleteModal() {
        setIsDeleteModal(true);
    }

    async function onChangeLinkType(newKey) {
        if (newKey && newKey !== link.linkType) {
            let connectedTaskCode = link?.connectedTask?.code;
            let linkId = link?.id;
            await TaskClient.deleteTaskLink(linkId);
            await TaskClient.createTaskLink(taskCode, connectedTaskCode, newKey);
            if (onDelete) {
                onDelete(link);
            }
        }
    }

    return (
        <div className={"task-link-list-item"}>
            {isDeleteModal &&
                <ModalWindow header={"Удаление связанной задачи"}
                             okButtonLabel={"Удалить"}
                             visible={true}
                             setIsDeleteModal={setIsDeleteModal}
                             onClickOk={async () => {
                                 if (link.id) {
                                     await TaskClient.deleteTaskLink(link.id);
                                 }
                                 if (onDelete) {
                                     onDelete(link);
                                 }
                                 setIsDeleteModal(false);
                             }}>
                    <div className={"modal-window-question"}>Вы уверены, что хотите удалить эту связанную задачу?</div>
                </ModalWindow>}
            <div className={"task-link-type-select"}>
                <SelectBox values={taskLinkTypes}
                           onChange={onChangeLinkType}
                           selectedKey={link.linkType}
                           name={"task-link-type"} />
            </div>
            <div className={"task-link-code"}>
                {link?.connectedTask?.code}
            </div>
            <div className={"task-link-subject"}>
                <a href={"/tasks/view/" + link?.connectedTask?.code}>{link?.connectedTask?.subject}</a>
            </div>
            <div className={"task-link-delete"}
                 onClick={openDeleteModal}>
                <svg viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5001 6H3.5"/>
                    <path d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"/>
                    <path d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" />
                </svg>
            </div>
        </div>
    );
}

export default TaskLink;
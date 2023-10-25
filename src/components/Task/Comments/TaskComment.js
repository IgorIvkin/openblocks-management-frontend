import './TaskComments.css'
import React, {useState} from "react";
import TaskUtilService from "../../../service/TaskUtilService";
import ModalWindow from "../../Modal/ModalWindow";
import TaskClient from "../../../clients/TaskClient";

function TaskComment({comment, onDelete}) {

    let [isEditContent, setIsEditContent] = useState(false);
    let [isDeleteModal, setIsDeleteModal] = useState(false);

    function openEditContent() {
        setIsEditContent(true);
    }

    async function closeEditContent(event) {
        let content = event.target.value;
        if (content && content !== comment.content && content !== '') {
            comment.content = content;
            await TaskClient.updateComment(comment.id, content);
        }
        setIsEditContent(false);
    }

    function openDeleteModal() {
        setIsDeleteModal(true);
    }

    return (
        <div className={"task-comments-item"}>
            {isDeleteModal &&
                <ModalWindow header={"Удаление комментария"}
                             okButtonLabel={"Удалить"}
                             visible={true}
                             setIsDeleteModal={setIsDeleteModal}
                             onClickOk={async () => {
                                 await TaskClient.deleteComment(comment.id);
                                 if (onDelete) {
                                     onDelete(comment.id);
                                 }
                                 setIsDeleteModal(false);
                             }}>
                    <div className={"modal-window-question"}>Вы уверены, что хотите удалить комментарий?</div>
                </ModalWindow>}
            <div className={"task-comment-content"}>
                {isEditContent &&
                    <textarea autoFocus={true}
                              onBlur={closeEditContent}
                              defaultValue={comment.content}></textarea>}
                {!isEditContent &&
                    <div>{comment.content}</div>}
            </div>
            <div className={"task-comment-menu"}>
                <div
                    className={"task-comment-date"}>{TaskUtilService.getLocalDateTimeByIsoDateTime(comment.createdAt)}</div>
                <div className={"task-comment-author"}>{comment.author.name}</div>
                <div className={"task-comment-edit"}>
                    <a href={'javascript:void(0)'}
                       onClick={openEditContent}>Редактировать</a>
                </div>
                <div className={"task-comment-delete"}>
                    <a href={'javascript:void(0)'}
                       onClick={openDeleteModal}>Удалить</a>
                </div>
            </div>
        </div>
    );
}

export default TaskComment;
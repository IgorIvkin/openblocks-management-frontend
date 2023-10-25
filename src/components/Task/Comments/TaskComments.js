import './TaskComments.css'
import React, {useEffect, useState} from "react";
import TaskClient from "../../../clients/TaskClient";
import TaskComment from "./TaskComment";

function TaskComments({taskCode}) {

    let [comments, setComments] = useState([]);
    let [isAddComment, setIsAddComment] = useState(false);
    let [content, setContent] = useState('');

    async function getTaskComments() {
        try {
            if (taskCode) {
                let response = await TaskClient.getTaskComments(taskCode);
                setComments(response.data);
            }
        } catch (error) {
            console.log("Cannot get task comments, reason: " + error)
        }
    }

    function onChangeComment(event) {
        let commentContent = event.target.value;
        setContent(commentContent);
    }

    function openAddComment() {
        setIsAddComment(true);
    }

    async function onClickAddComment(event) {
        if (content && content !== '') {
            await TaskClient.addComment(taskCode, content);
            await getTaskComments();
            setIsAddComment(false);
        }
    }

    async function onDeleteComment(commentId) {
        await getTaskComments();
    }

    useEffect(() => {
        getTaskComments();
    }, []);

    return (
        <div className={"task-comments"}>
            <div className={"task-comments-header"}>
                <h3>Комментарии к задаче</h3>
                <div className={"task-comment-add"}
                     onClick={openAddComment}>
                    <svg viewBox="0 0 22 22"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17H10V12H5V10H10V5H12V10H17V12H12Z" />
                    </svg> <span>Добавить</span>
                </div>
            </div>
            <div className={"task-comments-list"}>
                {comments.map((comment, i) => {
                    return (
                        <TaskComment comment={comment}
                                     onDelete={onDeleteComment} />
                    );
                })}
                {comments.length === 0 &&
                    <div className={"task-comments-empty"}>
                        Пока нет комментариев
                    </div>}
            </div>
            {isAddComment &&
                <div className={"task-comment-add-form"}>
                    <textarea autoFocus={true}
                              id={"comment-content"}
                              placeholder={"Добавьте ваш комментарий"}
                              onChange={onChangeComment}></textarea>
                    <button className={"btn-add"}
                            onClick={onClickAddComment}>Добавить</button>
                </div>}
        </div>
    );
}

export default TaskComments;
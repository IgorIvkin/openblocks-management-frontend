import './TaskHistory.css';
import React, {useState} from "react";
import TaskClient from "../../../clients/TaskClient";
import ReferenceClient from "../../../clients/ReferenceClient";
import TaskUtilService from "../../../service/TaskUtilService";

function TaskHistory({taskCode}) {

    let [history, setHistory] = useState([]);
    let [changeObjects, setChangeObjects] = useState([]);
    let [historyOpen, setHistoryOpen] = useState(false);

    async function getTaskHistory() {
        try {
            if (taskCode) {
                let response = await TaskClient.getTaskHistory(taskCode);
                setHistory(response.data);
            }
        } catch (error) {
            console.log("Cannot get task history, reason: " + error);
        }
    }

    async function getTaskHistoryChangeObjects() {
        try {
            let response = await ReferenceClient.getTaskHistoryChangeObjects();
            setChangeObjects(response.data);
        } catch (error) {
            console.log("Cannot get task history change objects, reason: " + error);
        }
    }

    async function showHistory() {
        await getTaskHistoryChangeObjects();
        await getTaskHistory();
        setHistoryOpen(true);
    }

    function getChangeObjectTitle(changeCode) {
        if (changeCode && changeObjects) {
            for (let changeObject of changeObjects) {
                if (changeObject?.code === changeCode) {
                    return changeObject?.title;
                }
            }
        }
        return "";
    }

    function getPreviousValue(changeCode, value) {
        if (value && value !== '') {
            if (changeCode === "DUE_DATE") {
                return (TaskUtilService.getLocalDateByIsoDate(value));
            } if (changeCode === "EXPLANATION") {
                return (<span dangerouslySetInnerHTML={
                    {__html: value}
                }/>);
            } else {
                return (value);
            }
        } else {
            return (
                <span className={"task-history-absent"}>Не было данных</span>
            );
        }
    }

    function getNewValue(changeCode, value) {
        if (value && value !== '') {
            if (changeCode === "DUE_DATE") {
                return (TaskUtilService.getLocalDateByIsoDate(value));
            } if (changeCode === "EXPLANATION") {
                return (<span dangerouslySetInnerHTML={
                    {__html: value}
                }/>);
            } else {
                return (value);
            }
        } else {
            return (
                <span className={"task-history-absent"}>Удалено</span>
            );
        }
    }

    function displayChange(changeCode) {
        if (changeCode === "CREATE") {
            return false;
        }
        return true;
    }

    return (
        <div className={"task-history"}>
            <div className={"task-history-header"}>
                <h3>История изменений</h3>

                {!historyOpen &&
                    <div className={"task-history-show"}
                         onClick={showHistory}>
                        <svg viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg"
                             strokeWidth="1"
                             strokeLinecap="round"
                             strokeLinejoin="miter">
                            <path d="M2,12S5,4,12,4s10,8,10,8-2,8-10,8S2,12,2,12Z"></path>
                            <circle cx="12" cy="12" r="4"></circle>
                        </svg>
                        <span>Показать</span>
                    </div>}
            </div>

            {historyOpen &&
                <div className={"task-history-items"}>
                    {history.map((item, i) => {
                        return (
                            <div key={"history-item-" + i}
                                 className={"task-history-item"}>
                                <div className={"task-history-item-header"}>
                                    <div className={"task-history-date"}>
                                        {TaskUtilService.getLocalDateTimeByIsoDateTime(item.createdAt)}
                                    </div>
                                    <div className={"task-history-author"}>
                                        {item.author?.name}
                                    </div>
                                </div>
                                <div className={"task-history-change-object"}>
                                    {getChangeObjectTitle(item.changeObject)}
                                </div>
                                {displayChange(item.changeObject) &&
                                    <div className={"task-history-change"}>
                                        <div className={"task-history-previous"}>
                                            {getPreviousValue(item.changeObject, item.previousValue)}
                                        </div>
                                        <div className={"task-history-arrow"}>
                                            →
                                        </div>
                                        <div className={"task-history-current"}>
                                            {getNewValue(item.changeObject, item.newValue)}
                                        </div>
                                    </div>}
                            </div>
                        );
                    })}
                </div>}
        </div>
    );
}

export default TaskHistory;
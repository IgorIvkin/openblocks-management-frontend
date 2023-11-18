import './Backlog.css';
import React, {useState} from "react";
import ModalWindow from "../Modal/ModalWindow";
import TaskUtilService from "../../service/TaskUtilService";
import SprintClient from "../../clients/SprintClient";
import {useNavigate} from "react-router-dom";

function SprintHeader({projectCode, sprintDetails, onCloseSprint}) {

    let navigate = useNavigate();

    let [isCloseModal, setIsCloseModal] = useState(false);

    function openCloseSprintModal() {
        setIsCloseModal(true);
    }

    function onClickCreateSprint() {
        navigate("/projects/" + projectCode + "/sprints");
    }

    return (
        <div>
            {isCloseModal &&
                <ModalWindow header={"Закрытие спринта"}
                             okButtonLabel={"Закрыть спринт"}
                             visible={true}
                             onClickCancel={() => setIsCloseModal(false)}
                             onClickOk={async () => {
                                 if (sprintDetails?.id) {
                                    await SprintClient.closeSprint(sprintDetails.id);
                                    if (onCloseSprint) {
                                        onCloseSprint(sprintDetails.id);
                                    }
                                 }
                                 setIsCloseModal(false);
                             }}>
                    <div className={"modal-window-question"}>
                        Вы уверены, что хотите завершить спринт?<br /><br />
                        <span className={"red-warning-text"}>Это действие нельзя будет отменить.</span><br /><br />
                        <u>Все задачи</u>, которые не закрыты или отклонены,
                        будут перемещены в бэклог &mdash; у них исчезнет привязка к спринту.
                    </div>
                </ModalWindow>}
            <div className={"sprint-header"}>
                <div className={"sprint-header-title"}>
                    Спринт <b>{sprintDetails?.title}</b>
                </div>
                <div className={"sprint-header-dates"}>
                    Идёт с {TaskUtilService.getLocalDateByIsoDate(sprintDetails.startDate)} по {TaskUtilService.getLocalDateByIsoDate(sprintDetails.endDate)}
                </div>
                <div className={"sprint-header-buttons"}>
                    <div className={"create-sprint"}
                         onClick={onClickCreateSprint}>
                        <svg viewBox="0 0 22 22"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17H10V12H5V10H10V5H12V10H17V12H12Z" />
                        </svg>
                        <span>Добавить спринт</span>
                    </div>

                    <div className={"close-sprint"}
                         onClick={openCloseSprintModal}>
                        <svg viewBox="0 0 24 24"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L16.8995 7.10051"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M7 7.00001L16.8995 16.8995"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                        <span>Завершить спринт</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SprintHeader;
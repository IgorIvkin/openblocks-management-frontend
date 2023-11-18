import './Sprint.css';
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import SprintClient from "../../clients/SprintClient";
import ErrorUtilService from "../../service/ErrorUtilService";
import TaskUtilService from "../../service/TaskUtilService";
import Datepicker from "../Input/Datepicker";

export default function Sprints({errorStore}) {

    let {projectCode} = useParams();

    let [initialized, setInitialized] = useState(false);
    let [sprints, setSprints] = useState([]);

    let [sprintTitle, setSprintTitle] = useState('');
    let [sprintStartDate, setSprintStartDate] = useState(null);
    let [sprintEndDate, setSprintEndDate] = useState(null);

    let [sprintTitleErrorStatus, setSprintTitleErrorStatus] = useState(false);
    let [sprintStartDateErrorStatus, setSprintStartDateErrorStatus] = useState(false);
    let [sprintEndDateErrorStatus, setSprintEndDateErrorStatus] = useState(false);

    async function getAllUnfinishedSprints() {
        try {
            let response = await SprintClient.getAllUnfinished(projectCode);
            setSprints(response.data);
            setInitialized(true);
        } catch (error) {
            ErrorUtilService.handleGenericApiError(errorStore, error,
                'Не удалось получить список спринтов по проекту ' + projectCode);
        }
    }

    function getDisabledDatePeriods() {
        let disabledDateRanges = [];
        for (let sprint of sprints) {
            let dateRange = {
                startDate: new Date(sprint.startDate),
                endDate: new Date(sprint.endDate)
            }
            disabledDateRanges.push(dateRange);
        }
        return disabledDateRanges;
    }

    function disabledByExistingSprints(date) {
        if (sprints.length > 0) {
            let isoDate = TaskUtilService.getIsoDateByLocalDate(date);
            let disabledDateRanges = getDisabledDatePeriods();
            for (let disabledRange of disabledDateRanges) {
                if (isoDate >= disabledRange.startDate && isoDate <= disabledRange.endDate) {
                    return true;
                }
            }
            return false;
        }
    }

    function getErrorClass(value) {
        if (value) {
            return 'input-error';
        }
        return '';
    }

    async function onClickCreateSprint() {
        let validated = true;

        if (!sprintTitle || sprintTitle === '') {
            setSprintTitleErrorStatus(true);
            validated = false;
        }

        if (!sprintStartDate) {
            setSprintStartDateErrorStatus(true);
            validated = false;
        }

        if (!sprintEndDate) {
            setSprintEndDateErrorStatus(true);
            validated = false;
        }

        if (validated) {
            try {
                await SprintClient.createSprint(projectCode, sprintTitle, sprintStartDate, sprintEndDate);
                setSprintTitle('');
                setSprintStartDate(null);
                setSprintEndDate(null);
                await getAllUnfinishedSprints();
            } catch (error) {
                ErrorUtilService.handleGenericApiError(errorStore, error,
                    'Не удалось создать новый спринт в проекте ' + projectCode);
            }
        }
    }

    useEffect(() => {
        getAllUnfinishedSprints();
    }, []);

    return (
        <div className={"sprint-list"}>
            <h1>Активные спринты проекта {projectCode}</h1>

            <div className={"sprint-list-items"}>
                <div className={"sprint-list-items-header sprint-list-items-item"}>
                    <div>
                        Название спринта
                    </div>
                    <div>
                        Дата начала
                    </div>
                    <div>
                        Дата завершения
                    </div>
                </div>
                {sprints
                    .map((sprint, i) => {
                        return (
                            <div key={"sprint" + i}
                                 className={"sprint-list-items-item"}>
                                <div>
                                    {sprint.title}
                                </div>
                                <div>
                                    {TaskUtilService.getLocalDateByIsoDate(sprint.startDate)}
                                </div>
                                <div>
                                    {TaskUtilService.getLocalDateByIsoDate(sprint.endDate)}
                                </div>
                            </div>
                        );
                    })}
            </div>

            {initialized &&
                <div className={"add-sprint-form"}>
                    <div className={"add-sprint-title"}>
                        <input type={"text"}
                               className={getErrorClass(sprintTitleErrorStatus)}
                               value={sprintTitle}
                               onChange={(event) => {
                                   setSprintTitleErrorStatus(false);
                                   setSprintTitle(event.target.value);
                               }}
                               placeholder={"Название спринта"}/>
                    </div>
                    <div className={"add-sprint-start-date"}>
                        <Datepicker id={"start-date-datepicker"}
                                    rangeId={"sprint-datepicker"}
                                    placeholder={"Начало спринта"}
                                    autoFocus={false}
                                    autoOpen={false}
                                    disabledBy={disabledByExistingSprints}
                                    additionalClasses={getErrorClass(sprintStartDateErrorStatus)}
                                    onChange={(date) => {
                                        setSprintStartDateErrorStatus(false);
                                        setSprintStartDate(TaskUtilService.getIsoDateByLocalDate(date));
                                    }}/>
                    </div>
                    <div className={"add-sprint-end-date"}>
                        <Datepicker id={"end-date-datepicker"}
                                    rangeId={"sprint-datepicker"}
                                    placeholder={"Окончание спринта"}
                                    autoFocus={false}
                                    autoOpen={false}
                                    disabledBy={disabledByExistingSprints}
                                    additionalClasses={getErrorClass(sprintEndDateErrorStatus)}
                                    onChange={(date) => {
                                        setSprintEndDateErrorStatus(false);
                                        setSprintEndDate(TaskUtilService.getIsoDateByLocalDate(date));
                                    }}/>
                    </div>
                    <div className={"add-sprint-button"}>
                        <button className={"btn-add"}
                                onClick={onClickCreateSprint}>Добавить спринт</button>
                    </div>
                </div>}
        </div>
    );
}
import './ProjectAccess.css';
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ProjectClient from "../../clients/ProjectClient";
import ErrorUtilService from "../../service/ErrorUtilService";
import ProjectAccess from "./ProjectAccess";
import UserAutocomplete from "../Task/UserAutocomplete";

export default function ProjectAccessList({errorStore}) {

    const {projectCode} = useParams();

    let [projectAccessList, setProjectAccessList] = useState([]);
    let [newUser, setNewUser] = useState(null);
    let [isProjectAdmin, setIsProjectAdmin] = useState(false);

    async function getAllProjectAccesses() {
        try {
            let response = await ProjectClient.getAllProjectAccesses(projectCode);
            setProjectAccessList(response.data);
        } catch (error) {
            ErrorUtilService.handleGenericApiError(errorStore, error,
                "Не получилось загрузить данные по доступам к проекту " + projectCode);
        }
    }

    async function onClickAddAccess() {
        try {
            if (newUser != null && newUser?.id) {
                await ProjectClient.addProjectAccess(projectCode, newUser.id, isProjectAdmin);
                setNewUser(null);
                setIsProjectAdmin(false);
                await getAllProjectAccesses();
            }
        } catch (error) {
            ErrorUtilService.handleGenericApiError(errorStore, error,
                "Не удалось добавить доступ к проекту " + projectCode);
        }
    }

    async function onChangeProjectAccess(projectCode, userId) {
        await getAllProjectAccesses();
    }

    useEffect(() => {
        getAllProjectAccesses();
    }, []);

    return (
        <div className={"project-access-list"}>

            <h1>Доступы к проекту {projectCode}</h1>

            <div className={"project-access-items"}>
                <div className={"project-access-item project-access-item-header"}>
                    <span>Пользователь</span>
                    <span>Администратор проекта</span>
                </div>
                {projectAccessList
                    .map((projectAccess, i) => {
                        return (
                            <ProjectAccess errorStore={errorStore}
                                           projectCode={projectCode}
                                           projectAccess={projectAccess}
                                           onChange={onChangeProjectAccess} />
                        );
                    })}
            </div>

            <div className={"project-access-add"}>
                <h3>Добавить доступ</h3>
                <div className={"project-access-add-form"}>
                    <div className={"project-access-form-username"}>
                        <UserAutocomplete id={"user-access-autocomplete"}
                                          autoFocus={false}
                                          onChange={(item, setAutocompleteValue) => {
                                              if (setAutocompleteValue) {
                                                  setAutocompleteValue(item?.name);
                                              }
                                              setNewUser(item);
                                          }} />
                    </div>
                    <div className={"project-access-form-is-project-admin"}>
                        <input type={"checkbox"}
                               checked={isProjectAdmin}
                               onChange={(event) => {
                                   setIsProjectAdmin(event.target.checked);
                               }} />
                    </div>
                    <div className={"project-access-form-add"}>
                        <button className={"btn-add"}
                                onClick={onClickAddAccess}>
                            Добавить
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );

}
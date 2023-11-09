import './ProjectList.css';
import React, {useState} from "react";
import ModalWindow from "../Modal/ModalWindow";
import ProjectClient from "../../clients/ProjectClient";
import ErrorUtilService from "../../service/ErrorUtilService";

function AddProjectModal({errorStore, onAddNewProject}) {

    let [projectTitle, setProjectTitle] = useState('');
    let [projectCode, setProjectCode] = useState('');

    let [projectTitleErrorStatus, setProjectTitleErrorStatus] = useState(false);
    let [projectCodeErrorStatus, setProjectCodeErrorStatus] = useState(false);

    let [isAddProjectModal, setIsAddProjectModal] = useState(false);

    function openAddProjectModal() {
        setIsAddProjectModal(true);
    }

    function getErrorStatus(value) {
        if (value) {
            return "input-error";
        }
        return "";
    }

    function onChangeProjectTitle(event) {
        setProjectTitleErrorStatus(false);
        setProjectTitle(event.target.value);
    }

    function onChangeProjectCode(event) {
        setProjectCodeErrorStatus(false);
        setProjectCode(event.target.value);
    }

    async function onClickCreateProject() {
        setProjectTitleErrorStatus(false);
        setProjectCodeErrorStatus(false);

        let validated = true;

        if (!projectTitle || projectTitle === '') {
            setProjectTitleErrorStatus(true);
            validated = false;
        }
        if (!projectCode || projectCode === '') {
            setProjectCodeErrorStatus(true);
            validated = false;
        }

        if (validated) {
            try {
                await ProjectClient.createProject(projectTitle, projectCode);
                if (onAddNewProject) {
                    onAddNewProject();
                }
                setIsAddProjectModal(false);
            } catch (error) {
                ErrorUtilService.handleGenericApiError(errorStore, error, 'Не удалось добавить проект');
            }
        }
    }

    return (
        <div>
            {isAddProjectModal &&
                <ModalWindow header={"Добавление нового проекта"}
                             okButtonLabel={"Добавить проект"}
                             visible={true}
                             onClickCancel={() => {
                                 setIsAddProjectModal(false);
                             }}
                             onClickOk={async () => {
                                 await onClickCreateProject();
                             }}>
                    <div className={"modal-window-question"}>
                        <div className={"add-project-modal-item"}>
                            <label htmlFor={"project-title"}>Название проекта</label>
                            <input type={"text"}
                                   id={"project-title"}
                                   className={getErrorStatus(projectTitleErrorStatus)}
                                   autoFocus={true}
                                   onChange={onChangeProjectTitle}
                                   placeholder={"Например, тестовый проект"}/>
                        </div>
                        <div className={"add-project-modal-item"}>
                            <label htmlFor={"project-code"}>Код проекта</label>
                            <input type={"text"}
                                   id={"project-code"}
                                   className={getErrorStatus(projectCodeErrorStatus)}
                                   onChange={onChangeProjectCode}
                                   placeholder={"Например, TEST"}/>
                        </div>
                    </div>
                </ModalWindow>}
            <button className={"btn-add"}
                    onClick={openAddProjectModal}>Добавить проект
            </button>
        </div>
    );
}

export default AddProjectModal;
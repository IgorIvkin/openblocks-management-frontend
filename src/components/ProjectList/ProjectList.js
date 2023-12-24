import './ProjectList.css'
import React, {useEffect, useState} from "react";
import ProjectListItem from "./ProjectListItem";
import ProjectClient from "../../clients/ProjectClient";
import UserClient from "../../clients/UserClient";
import AddProjectModal from "./AddProjectModal";

function ProjectList({errorStore}) {

    let [projects, setProjects] = useState([])
    let [projectTitle, setProjectTitle] = useState("")
    let [currentRoles, setCurrentRoles] = useState([]);

    async function getAllProjects() {
        let response = await ProjectClient.getAllProjects();
        let allProjects = response.data;
        setProjects(allProjects);
    }

    async function getUserRoles() {
        let response = await UserClient.getCurrentRoles();
        setCurrentRoles(response.data);
    }

    function isAdmin() {
        if (currentRoles) {
            for (let currentRole of currentRoles) {
                if (currentRole?.code === "ADMINISTRATOR") {
                    return true;
                }
            }
        }
        return false;
    }

    async function onAddNewProject() {
        await getAllProjects();
    }

    const onProjectTitleChange = (event) => {
        const value = event.target.value;
        setProjectTitle(value);
    };

    useEffect(() => {
        getAllProjects();
        getUserRoles();
    }, []);

    return (
        <div className={"project-list"}>
            <div className={"project-list-header"}>
                <h1>Проектные области</h1>
                {isAdmin() &&
                    <AddProjectModal errorStore={errorStore}
                                     onAddNewProject={onAddNewProject} />}
            </div>

            <div className={"filters"}>
                <input type={"text"}
                       placeholder={"Введите код проекта для поиска"}
                       value={projectTitle}
                       onChange={onProjectTitleChange}/>
            </div>

            {projects
                .filter((project) => {
                    if (projectTitle && projectTitle !== '') {
                        return project.code?.toLowerCase().startsWith(projectTitle?.toLowerCase())
                    } else {
                        return true;
                    }
                })
                .map((project, i) => {
                    return (
                        <ProjectListItem key={project.code}
                                         projectCode={project.code}
                                         projectTitle={project.title}/>
                    );
                })}
        </div>
    );
}

export default ProjectList;
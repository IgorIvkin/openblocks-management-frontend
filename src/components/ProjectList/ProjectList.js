import './ProjectList.css'
import React, {useEffect, useState} from "react";
import ProjectListItem from "./ProjectListItem";
import ProjectClient from "../../clients/ProjectClient";

function ProjectList() {

    let [projects, setProjects] = useState([])
    let [projectTitle, setProjectTitle] = useState("")

    async function getAllProjects() {
        let response = await ProjectClient.getAllProjects()
        let allProjects = response.data
        setProjects(allProjects)
    }

    const onProjectTitleChange = (event) => {
        const value = event.target.value;
        setProjectTitle(value);
    };

    useEffect(() => {
        getAllProjects()
    }, []);

    return (
        <div className={"project-list"}>
            <h1>Проектные области</h1>

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
                    <ProjectListItem projectCode={project.code}
                                     projectTitle={project.title} />
                );
            })}
        </div>
    );
}

export default ProjectList;
import './ProjectList.css'
import React from "react";
import {useNavigate} from "react-router-dom";

function ProjectListItem({projectCode, projectTitle}) {

    const navigate = useNavigate();

    function openProjectBacklog(event) {
        const projectCode = event.target.closest('.project-list .item').dataset.projectCode
        if (projectCode) {
            navigate("/backlog/" + projectCode)
        }
    }

    return (
        <div className={"item"} data-project-code={projectCode} onClick={openProjectBacklog}>
            <span className={"project-code"}><span>{projectCode}</span></span>
            <span className={"project-title"}>{projectTitle}</span>
        </div>
    );
}

export default ProjectListItem;
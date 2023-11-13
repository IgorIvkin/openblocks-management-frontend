import {restTemplate} from "../config/axiosConfig";

class ProjectClient {

    async getAllProjects() {
        return restTemplate.get("/api/v1/projects")
    }

    async createProject(projectTitle, projectCode) {
        return restTemplate.post("/api/v1/admin/projects", {
            title: projectTitle,
            code: projectCode
        })
    }

    async isCurrentUserAdmin(projectCode) {
        return restTemplate.get("/api/v1/projects/" + projectCode + "/is-admin");
    }
}

export default new ProjectClient();
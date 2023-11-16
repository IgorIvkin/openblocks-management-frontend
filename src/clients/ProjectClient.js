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

    async getAllProjectAccesses(projectCode) {
        return restTemplate.get("/api/v1/projects/" + projectCode + "/all-accesses");
    }

    async addProjectAccess(projectCode, userId, projectAdmin) {
        return restTemplate.post("/api/v1/projects/" + projectCode + "/access", {
            userId: userId,
            projectAdmin: projectAdmin
        });
    }

    async deleteProjectAccess(projectCode, userId) {
        return restTemplate.delete("/api/v1/projects/" + projectCode + "/access/" + userId);
    }
}

export default new ProjectClient();
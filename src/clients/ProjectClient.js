import {restTemplate} from "../config/axiosConfig";

class ProjectClient {

    async getAllProjects() {
        return restTemplate.get("/api/v1/projects")
    }
}

export default new ProjectClient();
import {restTemplate} from "../config/axiosConfig";

class SprintClient {

    async getAllSprints(projectCode) {
        return restTemplate.get("/api/v1/sprints/" + projectCode + "/all")
    }

    async getAllUnfinished(projectCode) {
        return restTemplate.get("/api/v1/sprints/" + projectCode + "/unfinished")
    }

    async closeSprint(sprintId) {
        return restTemplate.get("/api/v1/sprints/" + sprintId + "/close");
    }
}

export default new SprintClient();
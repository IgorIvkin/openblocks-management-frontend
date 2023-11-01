import {restTemplate} from "../config/axiosConfig";

class SprintClient {

    async getAllSprints(projectCode) {
        return restTemplate.get("/api/v1/sprints/" + projectCode + "/all")
    }

    async getAllUnfinished(projectCode) {
        return restTemplate.get("/api/v1/sprints/" + projectCode + "/unfinished")
    }
}

export default new SprintClient();
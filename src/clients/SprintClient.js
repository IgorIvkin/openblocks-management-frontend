import {restTemplate} from "../config/axiosConfig";

class SprintClient {

    async getAllUnfinished(projectCode) {
        return restTemplate.get("/api/v1/sprints/" + projectCode + "/unfinished")
    }
}

export default new SprintClient();
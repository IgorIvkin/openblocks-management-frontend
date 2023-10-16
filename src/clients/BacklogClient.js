import {restTemplate} from "../config/axiosConfig";

class BacklogClient {

    async getBacklog(request) {
        return restTemplate.post("/api/v1/backlog", request)
    }
}

export default new BacklogClient();
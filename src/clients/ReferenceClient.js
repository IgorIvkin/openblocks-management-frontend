import {restTemplate} from "../config/axiosConfig";

class ReferenceClient {

    async getTaskStatuses() {
        return restTemplate.get("/api/v1/references/statuses")
    }

    async getTaskPriorities() {
        return restTemplate.get("/api/v1/references/priorities")
    }
}

export default new ReferenceClient();
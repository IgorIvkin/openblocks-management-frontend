import {restTemplate} from "../config/axiosConfig";

class ReferenceClient {

    async getTaskStatuses() {
        return restTemplate.get("/api/v1/references/statuses");
    }

    async getTaskPriorities() {
        return restTemplate.get("/api/v1/references/priorities");
    }

    async getTaskLinkTypes() {
        return restTemplate.get("/api/v1/references/task-link-types");
    }

    async getTypes() {
        return restTemplate.get("/api/v1/references/types");
    }

    async getTaskHistoryChangeObjects() {
        return restTemplate.get("/api/v1/references/task-history-change-objects");
    }
}

export default new ReferenceClient();
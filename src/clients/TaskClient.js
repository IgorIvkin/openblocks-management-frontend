import {restTemplate} from "../config/axiosConfig";

class TaskClient {

    async getTask(taskCode) {
        return restTemplate.get("/api/v1/tasks/" + taskCode)
    }
}

export default new TaskClient();
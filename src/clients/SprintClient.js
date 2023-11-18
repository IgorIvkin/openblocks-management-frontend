import {restTemplate} from "../config/axiosConfig";

class SprintClient {

    async createSprint(projectCode, title, startDate, endDate) {
        return restTemplate.post("/api/v1/sprints", {
            projectCode: projectCode,
            title: title,
            startDate: startDate,
            endDate: endDate
        });
    }

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
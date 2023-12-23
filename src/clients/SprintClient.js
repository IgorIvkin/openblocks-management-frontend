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

    async updateSprintLayout(projectCode, sprintId, sprintLayout) {
        return restTemplate.put("/api/v1/sprint-layout/" + projectCode, {
            sprintId: sprintId,
            sprintLayout: sprintLayout
        });
    }

    async getSprintLayout(sprintId) {
        return restTemplate.get("/api/v1/sprint-layout/" + sprintId);
    }
}

export default new SprintClient();
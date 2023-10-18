import ReferenceClient from "../clients/ReferenceClient";

class ReferenceService {

    async getStatuses() {
        try {
            let response = await ReferenceClient.getTaskStatuses()
            let statuses = [];
            response.data.forEach((status) => {
                statuses[status.code] = status.title;
            })
            return statuses;
        } catch (error) {
            console.log("Cannot get task statuses, reason: " + error)
        }
    }

    async getPriorities() {
        try {
            let response = await ReferenceClient.getTaskPriorities()
            let priorities = [];
            response.data.forEach((priority) => {
                priorities[priority.code] = priority.title;
            })
            return priorities;
        } catch (error) {
            console.log("Cannot get task priorities, reason: " + error)
        }
    }
}

export default new ReferenceService();
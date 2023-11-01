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

    async getTypes() {
        try {
            let response = await ReferenceClient.getTypes()
            let types = [];
            response.data.forEach((type) => {
                types[type.code] = type.title;
            })
            return types;
        } catch (error) {
            console.log("Cannot get task types, reason: " + error)
        }
    }

    async getTaskLinkTypes() {
        try {
            let response = await ReferenceClient.getTaskLinkTypes()
            let taskLinkTypes = [];
            response.data.forEach((taskLinkType) => {
                taskLinkTypes[taskLinkType.code] = taskLinkType.title;
            })
            return taskLinkTypes;
        } catch (error) {
            console.log("Cannot get task link types, reason: " + error)
        }
    }
}

export default new ReferenceService();
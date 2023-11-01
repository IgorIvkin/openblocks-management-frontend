import {restTemplate} from "../config/axiosConfig";

class TaskClient {

    async getTask(taskCode) {
        return restTemplate.get("/api/v1/tasks/" + taskCode);
    }

    async cloneTask(taskCode) {
        return restTemplate.get("/api/v1/tasks/" + taskCode + "/clone");
    }

    async createTask(projectCode, taskData){
        return restTemplate.post("/api/v1/tasks/" + projectCode, taskData);
    }

    async updateTaskStatus(taskCode, status) {
        return restTemplate.put("/api/v1/tasks/" + taskCode + "/status", {
            status: status
        })
    }

    async updateTaskPriority(taskCode, priority) {
        return restTemplate.put("/api/v1/tasks/" + taskCode + "/priority", {
            priority: priority
        })
    }

    async updateTaskEstimation(taskCode, estimation) {
        return restTemplate.put("/api/v1/tasks/" + taskCode + "/estimation", {
            estimation: estimation
        })
    }

    async updateTaskDueDate(taskCode, dueDate) {
        return restTemplate.put("/api/v1/tasks/" + taskCode + "/due-date", {
            dueDate: dueDate
        })
    }

    async updateTaskExplanation(taskCode, explanation) {
        return restTemplate.put("/api/v1/tasks/" + taskCode + "/explanation", {
            explanation: explanation
        })
    }

    async updateTaskSubject(taskCode, subject) {
        return restTemplate.put("/api/v1/tasks/" + taskCode + "/subject", {
            subject: subject
        })
    }

    async updateTaskOwner(taskCode, ownerId) {
        return restTemplate.put("/api/v1/tasks/" + taskCode + "/owner", {
            ownerId: ownerId
        })
    }

    async updateTaskExecutor(taskCode, executorId) {
        return restTemplate.put("/api/v1/tasks/" + taskCode + "/executor", {
            executorId: executorId
        })
    }

    async updateTaskSprint(taskCode, sprintId) {
        return restTemplate.put("/api/v1/tasks/" + taskCode + "/sprint", {
            sprintId: sprintId !== '-' ? sprintId : null
        })
    }

    async getTaskComments(taskCode) {
        return restTemplate.get("/api/v1/task-comments/task/" + taskCode)
    }

    async addComment(taskCode, content) {
        return restTemplate.post("/api/v1/task-comments/" + taskCode, {
            content: content
        });
    }

    async updateComment(commentId, content) {
        return restTemplate.put("/api/v1/task-comments/" + commentId, {
            content: content
        });
    }

    async deleteComment(commentId) {
        return restTemplate.delete("/api/v1/task-comments/" + commentId);
    }

    async getTaskLinks(taskCode) {
        return restTemplate.get("/api/v1/task-links/" + taskCode);
    }

    async createTaskLink(taskCode, connectedTaskCode, linkType) {
        return restTemplate.post("/api/v1/task-links", {
            taskCode: taskCode,
            connectedTaskCode: connectedTaskCode,
            linkType: linkType
        });
    }

    async deleteTaskLink(id) {
        return restTemplate.delete("/api/v1/task-links/" + id);
    }

    async getTaskFiles(taskCode) {
        return restTemplate.get("/api/v1/task-files/" + taskCode);
    }

    async addTaskFile(taskCode, fileInput) {
        let formData = new FormData();
        formData.append("file", fileInput.files[0]);
        return restTemplate.post('/api/v1/task-files/' + taskCode, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    async deleteTaskFile(taskCode, fileId) {
        return restTemplate.delete("/api/v1/task-files/" + taskCode + "/" + fileId);
    }

    async getFile(fileId) {
        return restTemplate.get("/api/v1/task-files/file/" + fileId, {
            responseType: 'blob'
        });
    }

    async downloadFile(fileId, fileName) {
        restTemplate.get("/api/v1/task-files/file/" + fileId, {
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            link.click();
            setTimeout(() => window.URL.revokeObjectURL(url), 0);
        });
    }
}

export default new TaskClient();
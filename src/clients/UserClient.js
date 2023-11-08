import {restTemplate} from "../config/axiosConfig";

class UserClient {

    async searchUsers(name) {
        return restTemplate.get("/api/v1/users/name?name=" + encodeURI(name));
    }

    async getCurrentUser() {
        return restTemplate.get("/api/v1/users/current");
    }

    async updateUserName(userId, name) {
        return restTemplate.put("/api/v1/users/" + userId + "/name", {
            name: name
        });
    }

    async updatePassword(userId, oldPassword, newPassword, newPasswordRepeat) {
        return restTemplate.put("/api/v1/users/" + userId + "/password", {
            oldPassword: oldPassword,
            password: newPassword,
            passwordRepeat: newPasswordRepeat
        });
    }
}

export default new UserClient();
import {restTemplate} from "../config/axiosConfig";

class UserClient {

    async searchUsers(name) {
        return restTemplate.get("/api/v1/users/name?name=" + encodeURI(name))
    }
}

export default new UserClient();
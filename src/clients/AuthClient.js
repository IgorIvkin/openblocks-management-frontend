import {restTemplate} from "../config/axiosConfig";

class AuthClient {

    async login(login, password) {
        return restTemplate.post("/api/v1/auth", {
            "userName": login,
            "password": password
        })
    }
}

export default new AuthClient();
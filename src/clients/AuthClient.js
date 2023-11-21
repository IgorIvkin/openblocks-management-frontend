import {restTemplate} from "../config/axiosConfig";

class AuthClient {

    async login(login, password) {
        return restTemplate.post("/api/v1/auth", {
            "userName": login,
            "password": password
        });
    }

    async logout() {
        return restTemplate.get("/api/v1/auth/logout");
    }
}

export default new AuthClient();
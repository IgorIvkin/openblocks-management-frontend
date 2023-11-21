import AuthClient from "../clients/AuthClient";
import UserStore from "../store/UserStore";

class AuthService {

    async authenticate(userName, password) {
        let response = await AuthClient.login(userName, password)
        let token = response.data.token
        if (token) {
            localStorage.setItem("access_token", response.data.token)
            UserStore.setAuth(true)
            document.location.href = "/"
        } else {
            UserStore.setAuth(false)
        }
    };
}

export default new AuthService();
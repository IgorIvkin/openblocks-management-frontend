import AuthClient from "../clients/AuthClient";
import UserStore from "../store/UserStore";

class AuthService {

    async authenticate(userName, password) {
        try {
            let response = await AuthClient.login(userName, password)
            let token = response.data.token
            if (token) {
                localStorage.setItem("token", response.data.token)
                UserStore.setAuth(true)
                document.location.href = "/"
            } else {
                UserStore.setAuth(false)
            }
        } catch (error) {
            console.log("Authentication error: " + error)
        }
    };
}

export default new AuthService();
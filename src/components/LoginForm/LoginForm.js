import './LoginForm.css';
import React, {useState} from "react";
import AuthService from "../../service/AuthService";
import ErrorUtilService from "../../service/ErrorUtilService";

function LoginForm({errorStore}) {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const onLoginChange = (event) => {
        const value = event.target.value;
        setLogin(value);
    };

    const onPasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
    };

    async function authenticate(event) {
        event.preventDefault();
        try {
            await AuthService.authenticate(login, password);
        } catch (error) {
            ErrorUtilService.handleGenericApiError(errorStore, error, "Не удалось войти");
        }
    }

    return (
        <div className={"login-form"}>
            <form onSubmit={authenticate}>
                <div className={"login-form-item"}>
                    <label htmlFor={"login"}>Логин</label>
                    <input type={"text"}
                           value={login}
                           autoComplete={"off"}
                           placeholder={"test@example.com"}
                           name={"login"}
                           onChange={onLoginChange}/>
                </div>

                <div className={"login-form-item"}>
                    <label htmlFor={"password"}>Пароль</label>
                    <input type={"password"}
                           autoComplete={"off"}
                           value={password}
                           name={"password"}
                           onChange={onPasswordChange}/>
                </div>

                <div className={"login-form-item"}>
                    <button className={"btn-add"}>
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
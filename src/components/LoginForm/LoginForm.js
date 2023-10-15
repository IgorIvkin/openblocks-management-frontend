import React, {useState} from "react";
import AuthService from "../../service/AuthService";

function LoginForm() {

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
        event.preventDefault()
        await AuthService.authenticate(login, password)
    }

    return (
        <div className={"login-form"}>
            <form onSubmit={authenticate}>
                <label htmlFor={"login"}>Логин</label>
                <input type={"text"}
                       value={login}
                       placeholder={"test@example.com"}
                       name={"login"}
                       onChange={onLoginChange}/>
                <br/>
                <label htmlFor={"password"}>Пароль</label>
                <input type={"password"}
                       value={password}
                       name={"password"}
                       onChange={onPasswordChange}/>
                <button>
                    Войти
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
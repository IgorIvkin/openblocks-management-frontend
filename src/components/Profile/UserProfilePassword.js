import './Profile.css';
import React, {useState} from "react";
import UserClient from "../../clients/UserClient";
import ErrorUtilService from "../../service/ErrorUtilService";

function UserProfilePassword({userCard, errorStore}) {

    let [oldPassword, setOldPassword] = useState('');
    let [newPassword, setNewPassword] = useState('');
    let [newPasswordRepeat, setNewPasswordRepeat] = useState('');

    let [passwordUpdated, setPasswordUpdated] = useState(false);

    let [oldPasswordErrorStatus, setOldPasswordErrorStatus] = useState(false);
    let [newPasswordErrorStatus, setNewPasswordErrorStatus] = useState(false);
    let [newPasswordRepeatErrorStatus, setNewPasswordRepeatErrorStatus] = useState(false);

    function getErrorStatus(status) {
        if (status) {
            return "input-error";
        }
        return "";
    }

    async function onClickChangePassword() {
        setOldPasswordErrorStatus(false);
        setNewPasswordErrorStatus(false);
        setNewPasswordRepeatErrorStatus(false);

        if (!oldPassword || oldPassword === '') {
            setOldPasswordErrorStatus(true);
        } else if (!newPassword || newPassword === '') {
            setNewPasswordErrorStatus(true);
            setNewPasswordRepeatErrorStatus(true);
        } else if (!newPasswordRepeat || newPasswordRepeat === '' || newPassword !== newPasswordRepeat) {
            setNewPasswordErrorStatus(true);
            setNewPasswordRepeatErrorStatus(true);
        } else if (userCard?.id) {
            try {
                await UserClient.updatePassword(userCard.id, oldPassword, newPassword, newPasswordRepeat);
                setPasswordUpdated(true);
            } catch (error) {
                ErrorUtilService.handleGenericApiError(errorStore, error, "Не удалось обновить пароль");
            }
        }
    }

    return (
        <div className={"user-card-password"}>
            Чтобы изменить свой пароль, введите старый пароль и два раза новый.
            <div className={"user-card-password-item"}>
                <label htmlFor={"old-password"}>Старый пароль</label>
                <input type={"password"}
                       id={"old-password"}
                       className={getErrorStatus(oldPasswordErrorStatus)}
                       onChange={(event) => setOldPassword(event.target.value)} />
            </div>
            <div className={"user-card-password-item"}>
                <label htmlFor={"new-password"}>Новый пароль</label>
                <input type={"password"}
                       id={"new-password"}
                       className={getErrorStatus(newPasswordErrorStatus)}
                       onChange={(event) => setNewPassword(event.target.value)} />
            </div>
            <div className={"user-card-password-item"}>
                <label htmlFor={"new-password-repeat"}>Повторите пароль</label>
                <input type={"password"}
                       id={"new-password-repeat"}
                       className={getErrorStatus(newPasswordRepeatErrorStatus)}
                       onChange={(event) => setNewPasswordRepeat(event.target.value)}/>
            </div>
            {passwordUpdated &&
                <div className={"user-card-password-item item-success"}>Ваш пароль успешно обновлен</div> }
            <div className={"user-card-password-item"}>
                <button className={"btn-add"}
                        onClick={onClickChangePassword}>Изменить</button>
            </div>
        </div>
    );
}

export default UserProfilePassword;
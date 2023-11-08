import './Profile.css';
import React, {useState} from "react";
import UserClient from "../../clients/UserClient";

function UserProfile({userCard}) {

    let [isEditUserName, setIsEditUserName] = useState(false);

    function openEditUserName() {
        setIsEditUserName(true);
    }

    function onKeyDownUserName(event) {
        event.stopPropagation();
        if (event.key === 'Enter') {
            event.target.blur();
        }
    }

    async function onBlurEditUserName(event) {
        let value = event.target.value;
        if (userCard?.id && value !== userCard?.name) {
            await UserClient.updateUserName(userCard.id, value);
            userCard.name = value;
        }
        setIsEditUserName(false);
    }

    return (
        <div className={"user-card-profile"}>
            <div className={"user-card-profile-items"}>
                <div className={"user-card-profile-item"}>
                    <div className={"profile-item-name"}>
                        Логин
                    </div>
                    <div className={"profile-item-value"}>
                        {userCard?.login}
                    </div>
                </div>
                <div className={"user-card-profile-item"}>
                    <div className={"profile-item-name"}>
                        Отображаемое имя
                    </div>
                    <div className={"profile-item-value"}
                         onClick={openEditUserName}>
                        {!isEditUserName &&
                            <span className={"profile-item-editable"}>{userCard?.name}</span>}
                        {isEditUserName &&
                            <input type={"text"}
                                   autoFocus={true}
                                   defaultValue={userCard?.name}
                                   onBlur={onBlurEditUserName}
                                   onKeyDown={onKeyDownUserName}/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
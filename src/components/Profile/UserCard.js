import './Profile.css';
import React, {useState, useEffect} from "react";
import UserClient from "../../clients/UserClient";
import UserProfile from "./UserProfile";
import UserProfilePassword from "./UserProfilePassword";

function UserCard({activeTab, errorStore}) {

    let [userCard, setUserCard] = useState({});

    async function getUserCard() {
        try {
            let response = await UserClient.getCurrentUser()
            setUserCard(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function getActiveTabClass(value) {
        if (value === activeTab) {
            return "active-tab";
        }
        return "";
    }

    useEffect(() => {
        getUserCard();
    }, []);

    return (
        <div className={"user-card"}>

            <div className={"user-card-header"}>
                <h1>Мой профиль</h1>
            </div>

            <div className={"user-card-common"}>
                <div className={"user-card-menu"}>
                    <div className={"user-card-menu-item " + getActiveTabClass("profile")}>
                        <a href={"/profile"}>Мой профиль</a>
                    </div>
                    <div className={"user-card-menu-item " + getActiveTabClass("password")}>
                        <a href={"/profile/password"}>Пароль</a>
                    </div>
                </div>
                <div className={"user-card-info"}>
                    {activeTab === "profile" &&
                        <UserProfile userCard={userCard} />}
                    {activeTab === "password" &&
                        <UserProfilePassword errorStore={errorStore} userCard={userCard} /> }
                </div>
            </div>

        </div>
    );
}

export default UserCard;
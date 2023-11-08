import React from "react";
import UserStore from "../../store/UserStore";
import './ManagementHeader.css';
import {useLocation} from "react-router-dom";

function ManagementHeader() {

    let location = useLocation();

    function addSelectedClass(navigationElements) {
        if (location && location.pathname) {
            for (let navigationElement of navigationElements) {
                if (
                    (location.pathname === '/' && navigationElement === '/')
                    || (location.pathname.includes('/' + navigationElement))) {
                    return "selected-item";
                }
            }
        }
        return '';
    }

    return (
        <div className={"generic-header"}>
            <div className={"logo"}>
                <b className={"logo-openblocks"}>Openblocks</b> Управление
            </div>
            <div className={"menu"}>
                <div className={"item " + addSelectedClass(["/", "backlog"])}>
                    <a href={"/"}>Бэклог</a>
                </div>
                <div className={"item " + addSelectedClass(["search"])}>
                    <a href={"/search"}>Поиск</a>
                </div>
                <div className={"item " + addSelectedClass(["projects"])}>
                    <a href={"/projects"}>Проекты</a>
                </div>
            </div>
            <div className={"user"}>
                {UserStore.checkAuth() &&
                    <div className={"user-title"}>
                        <svg viewBox="0 0 24 24"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
                            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" />
                        </svg>
                        <div>
                            <a href={"/profile"}>Мой профиль</a>
                        </div>
                    </div>
                }
                {!UserStore.checkAuth() &&
                    <div className={"user-title"}><a href={"/login"}>Войти</a></div>
                }
            </div>
        </div>
    );
}

export default ManagementHeader;
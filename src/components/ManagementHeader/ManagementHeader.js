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
                    <div className={"user-title"}>Добрый день!</div>
                }
                {!UserStore.checkAuth() &&
                    <div className={"user-title"}><a href={"/login"}>Войти</a></div>
                }
            </div>
        </div>
    );
}

export default ManagementHeader;
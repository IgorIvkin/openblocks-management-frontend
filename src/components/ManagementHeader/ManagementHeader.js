import React from "react";
import UserStore from "../../store/UserStore";
import './ManagementHeader.css';

function ManagementHeader() {
    return (
        <div className={"generic-header"}>
            <div className={"logo"}>
                <b className={"logo-openblocks"}>Openblocks</b> Управление
            </div>
            <div className={"menu"}>
                <div className={"item"}>
                    <a href={"/"}>Бэклог</a>
                </div>
                <div className={"item"}>
                    <a href={"/board"}>Доски</a>
                </div>
                <div className={"item"}>
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
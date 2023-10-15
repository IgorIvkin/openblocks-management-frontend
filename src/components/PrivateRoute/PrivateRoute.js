import React from "react";
import UserStore from "../../store/UserStore";
import {Outlet, Navigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

function PrivateRoute(props) {
    if (UserStore.checkAuth()) {
        return <Outlet />
    } else {
        return <Navigate to="/login" />;
    }
}

export default observer(PrivateRoute);
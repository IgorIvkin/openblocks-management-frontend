import './App.css';
import React from "react";
import ManagementHeader from "./components/ManagementHeader/ManagementHeader";
import ManagementFooter from "./components/ManagementFooter/ManagementFooter";
import LoginForm from "./components/LoginForm/LoginForm";
import Backlog from "./components/Backlog/Backlog";
import ProjectList from "./components/ProjectList/ProjectList";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {observer} from 'mobx-react-lite'
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import TaskCard from "./components/Task/TaskCard";

const App = observer(() => {

    return (
        <div className={"generic-container"}>
            <ManagementHeader />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="" element={<Backlog />} />
                        <Route path="backlog" element={<Backlog />} />
                        <Route path="backlog/:projectCode" element={<Backlog />} />
                        <Route path="projects" element={<ProjectList />} />
                        <Route path="tasks/view/:taskCode" element={<TaskCard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <ManagementFooter />
        </div>
    );
});

export default App;

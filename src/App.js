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
import AddTaskForm from "./components/Task/Add/AddTaskForm";
import DetailedSearch from "./components/Search/DetailedSearch";
import ErrorContext from "./components/ErrorContext/ErrorContext";
import errorStore from "./store/ErrorStore";

const App = observer(() => {

    return (
        <div className={"generic-container"}>
            <ErrorContext errorStore={errorStore}>
                <ManagementHeader/>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginForm/>}/>
                        <Route path="/" element={<PrivateRoute/>}>
                            <Route path="" element={<Backlog/>}/>
                            <Route path="backlog" element={<Backlog/>}/>
                            <Route path="backlog/:projectCode" element={<Backlog/>}/>
                            <Route path="projects" element={<ProjectList/>}/>
                            <Route path="tasks/view/:taskCode" element={<TaskCard errorStore={errorStore} />}/>
                            <Route path="add-task" element={<AddTaskForm/>}/>
                            <Route path="add-task/:projectCode" element={<AddTaskForm/>}/>
                            <Route path="search" element={<DetailedSearch/>}/>
                            <Route path="search/:projectCode" element={<DetailedSearch/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
                <ManagementFooter/>
            </ErrorContext>
        </div>
    );
});

export default App;

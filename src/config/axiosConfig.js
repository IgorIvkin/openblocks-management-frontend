import axios from "axios";
import {DefaultLocalConfig} from "./localConfig";

let appConfig;
if (window.AppConfig) {
    appConfig = window.AppConfig;
} else {
    appConfig = DefaultLocalConfig
}

export const restTemplate = axios.create({
    baseURL: appConfig.baseUrl,
    withCredentials: true,
});

restTemplate.interceptors.request.use((request) => {
    let token = localStorage.getItem("token");
    if (token) {
        request.headers['Authorization'] = "Bearer " + token;
    }
    return request;
});
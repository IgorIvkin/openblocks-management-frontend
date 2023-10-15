import axios from "axios";

export const restTemplate = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8080/",
});

restTemplate.interceptors.request.use((request) => {
    let token = localStorage.getItem("token")
    if (token) {
        request.headers['Authorization'] = "Bearer " + token;
    }
    return request;
});
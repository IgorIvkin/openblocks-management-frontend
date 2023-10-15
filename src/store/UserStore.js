import {makeAutoObservable} from "mobx";

class UserStore {

    isAuthenticated = false;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    setAuth(auth) {
        this.isAuthenticated = auth;
    }

    checkAuth() {
        if (localStorage.getItem("token")) {
            this.isAuthenticated = true;
        } else {
            this.isAuthenticated = false;
        }
        return this.isAuthenticated;
    }

}

export default new UserStore();
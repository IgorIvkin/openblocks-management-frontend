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
        this.isAuthenticated = !!localStorage.getItem("access_token");
        return this.isAuthenticated;
    }

}

export default new UserStore();
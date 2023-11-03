import {makeAutoObservable} from "mobx";

class ErrorStore {

    errorObject = false;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    setError(error) {
        this.errorObject = error;
    }

    getError() {
        return this.errorObject;
    }

}

export default new ErrorStore();
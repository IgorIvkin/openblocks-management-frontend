class ErrorUtilService {

    handleGenericApiError(errorStore, error, strErrorMessage) {
        let techDetails;
        if (error.response) {
            techDetails = '[' + error.response.data.errorCode + '] ' + error.response.data.message;
        } else {
            techDetails = error.message;
        }
        errorStore.setError({
            message: strErrorMessage,
            techDetails: techDetails,
            errorObject: error
        });
    }
}

export default new ErrorUtilService();
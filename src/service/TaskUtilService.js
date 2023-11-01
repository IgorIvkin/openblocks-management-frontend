class TaskUtilService {

    getEstimation(taskEstimation) {
        if (taskEstimation) {
            const weeks = Math.floor(taskEstimation / 5);
            const remainderDays = taskEstimation % 5;
            if (weeks < 1) {
                return taskEstimation + 'д';
            } else if (remainderDays > 0) {
                return weeks + 'н ' + remainderDays + 'д';
            } else {
                return weeks + 'н';
            }
        }
        return "-"
    }

    getIsoDateByLocalDate(date) {
        if (date) {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        }
        return null;
    }

    getLocalDateByIsoDate(isoDate) {
        if (isoDate) {
            let date = new Date(isoDate);
            return date.toLocaleDateString();
        }
        return "-";
    }

    getLocalDateTimeByIsoDateTime(isoDateTime) {
        if (isoDateTime) {
            let date = new Date(isoDateTime);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
        return "-";
    }
}

export default new TaskUtilService();
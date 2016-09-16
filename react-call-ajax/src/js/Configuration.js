const Spinner = require("../../../lib/react-spinner/js/Spinner");
const AlertBox = require("../../../lib/react-alert-box/js/AlertBox");

const Configuration = {
    showSpinner: Spinner.Actions.displaySpinner,
    hideSpinner: Spinner.Actions.hideSpinner,
    displayRestError: AlertBox.Actions.displayRestError,
    getAuthToken: undefined,
    requireLogin: () => {},
    defaultFail: () => {}
};

module.exports = Configuration;
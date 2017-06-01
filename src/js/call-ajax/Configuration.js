const Spinner = require("../spinner/Spinner");
const AlertBox = require("../alert-box/AlertBox");

const Configuration = {
    showSpinner: Spinner.Actions.displaySpinner,
    hideSpinner: Spinner.Actions.hideSpinner,
    displayRestError: AlertBox.Actions.displayRestError,
    withCredentials: undefined,     // Special XHR header to add if authentication is needed
    getAuthToken: undefined,        // Function to call when auth-token is needed
    requireLogin: () => {},         // Function that will be called in case of Unauthorized response
    defaultFail: () => {}           // Default function called when any request failed
};

module.exports = Configuration;
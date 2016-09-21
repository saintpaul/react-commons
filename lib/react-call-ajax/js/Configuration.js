"use strict";

var Spinner = require("../../../lib/react-spinner/js/Spinner");
var AlertBox = require("../../../lib/react-alert-box/js/AlertBox");

var Configuration = {
    showSpinner: Spinner.Actions.displaySpinner,
    hideSpinner: Spinner.Actions.hideSpinner,
    displayRestError: AlertBox.Actions.displayRestError,
    withCredentials: undefined, // Special XHR header to add if authentication is needed
    getAuthToken: undefined, // Function to call when auth-token is needed
    requireLogin: function requireLogin() {}, // Function that will be called in case of Unauthorized response
    defaultFail: function defaultFail() {} // Default function called when any request failed
};

module.exports = Configuration;
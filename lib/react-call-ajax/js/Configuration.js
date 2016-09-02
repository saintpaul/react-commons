"use strict";

var _require = require("../../../lib/react-spinner/js");

var Spinner = _require.Spinner;

var AlertBox = require("../../../lib/react-alert-box/js/AlertBox");

var Configuration = {
    showSpinner: Spinner.Actions.displaySpinner,
    hideSpinner: Spinner.Actions.hideSpinner,
    displayRestError: AlertBox.Actions.displayRestError,
    getAuthToken: undefined,
    requireLogin: function requireLogin() {},
    defaultFail: function defaultFail() {}
};

module.exports = Configuration;
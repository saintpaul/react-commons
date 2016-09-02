'use strict';

var Reflux = require('reflux');

var AlertBoxActions = {
    displayRestError: Reflux.createAction({ asyncResult: true }),
    displayAlertError: Reflux.createAction({ asyncResult: true }),
    displayAlertWarning: Reflux.createAction({ asyncResult: true }),
    displayAlertInfo: Reflux.createAction({ asyncResult: true }),
    displayAlertSuccess: Reflux.createAction({ asyncResult: true }),
    displayAlertDefault: Reflux.createAction({ asyncResult: true }),
    ignoreNextBadRequestAlert: Reflux.createAction({ sync: true }),
    hideAlert: Reflux.createAction({ asyncResult: true })
};

module.exports = AlertBoxActions;
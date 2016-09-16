'use strict';

var Reflux = require('reflux');

var SpinnerActions = {
    displaySpinner: Reflux.createAction({ asyncResult: true }),
    hideSpinner: Reflux.createAction({ asyncResult: true }),
    updateMessage: Reflux.createAction(),
    updateProgress: Reflux.createAction()
};

module.exports = SpinnerActions;
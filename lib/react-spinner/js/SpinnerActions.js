'use strict';

var Reflux = require('reflux');

var SpinnerActions = {
    displaySpinner: Reflux.createAction({ asyncResult: true }),
    hideSpinner: Reflux.createAction({ asyncResult: true })
};

module.exports = SpinnerActions;
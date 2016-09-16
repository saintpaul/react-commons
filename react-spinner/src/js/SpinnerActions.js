const Reflux = require('reflux');


const SpinnerActions = {
    displaySpinner          : Reflux.createAction({asyncResult: true}),
    hideSpinner             : Reflux.createAction({asyncResult: true}),
    updateMessage           : Reflux.createAction(),
    updateProgress          : Reflux.createAction(),
};

module.exports = SpinnerActions;

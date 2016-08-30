const Reflux = require('reflux');


const SpinnerActions = {
    displaySpinner          : Reflux.createAction({asyncResult: true}),
    hideSpinner             : Reflux.createAction({asyncResult: true})
};

module.exports = SpinnerActions;

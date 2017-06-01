const Reflux = require('reflux');


const AlertBoxActions = {
    displayRestError            : Reflux.createAction({asyncResult: true}),
    displayAlertError           : Reflux.createAction({asyncResult: true}),
    displayAlertWarning         : Reflux.createAction({asyncResult: true}),
    displayAlertInfo            : Reflux.createAction({asyncResult: true}),
    displayAlertSuccess         : Reflux.createAction({asyncResult: true}),
    displayAlertDefault         : Reflux.createAction({asyncResult: true}),
    startIgnoreBadRequest       : Reflux.createAction({sync: true}), // Will ignore every BadRequest. No message will be displayed.
    stopIgnoreBadRequest        : Reflux.createAction({sync: true}), // Will stop ignoring BadRequest.
    startIgnoreError            : Reflux.createAction({sync: true}), // Will ignore error (BadRequest, InternalServerError). No message will be displayed.
    stopIgnoreError             : Reflux.createAction({sync: true}), // Will stop ignore error.
    hideAlert                   : Reflux.createAction({asyncResult: true})
};

module.exports = AlertBoxActions;

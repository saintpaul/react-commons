const React = require('react');
const { AlertBox } = require('./index');

// If needed, default configuration can be overrided
//AlertBox.Config.ERROR = {
//    closable: false,
//    reloadable: true
//};

class DemoAlertBox extends React.Component {

    constructor(props) {
        super(props);
    }

    displayAlertError = () => AlertBox.Actions.displayAlertError();
    displayAlertErrorWithMessage = () => AlertBox.Actions.displayAlertError({ message: "<h3>Custom HTML message</h3>", reloadable: true, closable: true });
    displayAlertErrorWithReactMessage = () => AlertBox.Actions.displayAlertError({ reactMessage: <h3>Custom React message</h3>, reloadable: true, closable: true });
    displayAlertWarning = () => AlertBox.Actions.displayAlertWarning();
    displayAlertInfo = () => AlertBox.Actions.displayAlertInfo();
    displayAlertSuccess = () => AlertBox.Actions.displayAlertSuccess();
    displayInternalServerError = () => AlertBox.Actions.displayRpackestError({
        status: 500
    });
    displayBadRequestError = () => AlertBox.Actions.displayRestError({
        status: 400
    });
    displayBadResquestWithMessageError = () => AlertBox.Actions.displayRestError({
        status: 400,
        response: {
            error: "Error from backend"
        }
    });
    ignoreNextBadRequest = () => AlertBox.Actions.startIgnoreBadRequest();
    stopIgnoreNextBadRequest = () => AlertBox.Actions.stopIgnoreBadRequest();
    ignoreNextError = () => AlertBox.Actions.startIgnoreError();
    stopIgnoreNextError = () => AlertBox.Actions.stopIgnoreError();
    hideAlert = () => AlertBox.Actions.hideAlert();

    render = () => (
        <div>
            <h1>Demo react-alert-box</h1>
            <AlertBox/>
            <button onClick={this.displayAlertError}>Display Alert (error)</button>
            <button onClick={this.displayAlertErrorWithMessage}>Display Alert (error + message)</button>
            <button onClick={this.displayAlertErrorWithReactMessage}>Display Alert (error + React message)</button>
            <button onClick={this.displayAlertWarning}>Display Alert (warning)</button>
            <button onClick={this.displayAlertInfo}>Display Alert (info)</button>
            <button onClick={this.displayAlertSuccess}>Display Alert (success)</button>
            <button onClick={this.displayInternalServerError}>Display RestError (500)</button>
            <button onClick={this.displayBadRequestError}>Display RestError (400)</button>
            <button onClick={this.displayBadResquestWithMessageError}>Display RestError (400 + message)</button>
            <button onClick={this.displayBadResquestWithMessageError}>Display RestError (400 + react message)</button>
            <br/>
            <button onClick={this.ignoreNextBadRequest}>Ignore next BadRequest</button>
            <button onClick={this.stopIgnoreNextBadRequest}>STOP Ignore next BadRequest</button>
            <button onClick={this.ignoreNextError}>Ignore next error</button>
            <button onClick={this.stopIgnoreNextError}>STOP Ignore next error</button>
            <br/>
            <button onClick={this.hideAlert}>Hide Alert</button>
        </div>
    );

}

module.exports = DemoAlertBox;
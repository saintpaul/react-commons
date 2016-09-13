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
    displayAlertErrorWithMessage = () => AlertBox.Actions.displayAlertError({ message: "Custom message", reloadable: true, closable: true });
    displayAlertWarning = () => AlertBox.Actions.displayAlertWarning();
    displayAlertInfo = () => AlertBox.Actions.displayAlertInfo();
    displayAlertSuccess = () => AlertBox.Actions.displayAlertSuccess();
    displayInternalServerError = () => AlertBox.Actions.displayRestError({
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
    ignoreNextBadRequest = () => AlertBox.Actions.ignoreNextBadRequestAlert();

    render = () => (
        <div>
            <h1>Demo react-alert-box</h1>
            <AlertBox/>
            <button onClick={this.displayAlertError}>Display Alert (error)</button>
            <button onClick={this.displayAlertErrorWithMessage}>Display Alert (error + message)</button>
            <button onClick={this.displayAlertWarning}>Display Alert (warning)</button>
            <button onClick={this.displayAlertInfo}>Display Alert (info)</button>
            <button onClick={this.displayAlertSuccess}>Display Alert (success)</button>
            <button onClick={this.displayInternalServerError}>Display RestError (500)</button>
            <button onClick={this.displayBadRequestError}>Display RestError (400)</button>
            <button onClick={this.displayBadResquestWithMessageError}>Display RestError (400 + message)</button>
            <button onClick={this.ignoreNextBadRequest}>Ignore next BadRequest</button>
        </div>
    );

}

module.exports = DemoAlertBox;
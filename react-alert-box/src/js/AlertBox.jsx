const React             = require("react");
const RefluxComponent   = require("../../../lib/react-reflux-component/js/RefluxComponent");
const _                 = require("lodash");
const $                 = require("jquery");
const classnames        = require("classnames");

const AlertBoxActions   = require("./AlertBoxActions");
const AlertMessage      = require("./AlertMessage");

// TODO RCH : refactor using an 'AlertMessage' class



/**
 * Display/Hide an alert message.
 * This component also handles HTTP failed requests and automatically display an error message according to returned status code.
 *
 * Alert object looks like : { type: "default|success|info|warning|alert", message: "An a message", closable: true|false}
 *
 * This component uses AppActions in order to display/hide error message
 */
class AlertBox extends RefluxComponent {

    constructor(props) {
        super(props);
        this.state = this.initialState();

        this.listenToAction(AlertBoxActions.displayRestError,            this.onDisplayRestError);
        this.listenToAction(AlertBoxActions.displayAlertError,           this.onDisplayAlertError);
        this.listenToAction(AlertBoxActions.displayAlertWarning,         this.onDisplayAlertWarning);
        this.listenToAction(AlertBoxActions.displayAlertInfo,            this.onDisplayAlertInfo);
        this.listenToAction(AlertBoxActions.displayAlertSuccess,         this.onDisplayAlertSuccess);
        this.listenToAction(AlertBoxActions.displayAlertDefault,         this.onDisplayAlertDefault);
        this.listenToAction(AlertBoxActions.ignoreNextBadRequestAlert,   this.ignoreNextBadRequestAlert);
        this.listenToAction(AlertBoxActions.hideAlert,                   this.onHideAlert);
    }

    initialState = () => ({
        alert: null,
        ignoreNextBadRequestAlert: false
    });

    onDisplayRestError = (restError) => {
        switch(restError.status) {
            case 400:
                // Try to translate error to understandable message
                if(restError.response && restError.response.error) {
                    if(this.state.ignoreNextBadRequestAlert) {
                        this.setState({ ignoreNextBadRequestAlert: false});
                    } else {
                        var translatedError = this.props.translationFn(restError) || this.props.defaultMessage;
                        this.onDisplayAlertWarning({ message: translatedError, reloadable: true });
                    }
                } else {
                    this.onDisplayAlertError({ message: this.props.defaultMessage });
                }
                break;
            case 500:
                this.onDisplayAlertError({ message: this.props.defaultMessage });
                break;
            default: // By default, don't catch other errors to let the power for other components to catch it
        }
    };

    /** Helpers functions that builds an alert message **/
    onDisplayAlertError     = (alert = {}) => this.setAlert( AlertMessage.error(alert) );
    onDisplayAlertWarning   = (alert = {}) => this.setAlert( AlertMessage.warning(alert) );
    onDisplayAlertInfo      = (alert = {}) => this.setAlert( AlertMessage.info(alert) );
    onDisplayAlertSuccess   = (alert = {}) => this.setAlert( AlertMessage.success(alert) );
    onDisplayAlertDefault   = (alert = {}) => this.setAlert( AlertMessage.default(alert) );

    ignoreNextBadRequestAlert = () => this.setState({ignoreNextBadRequestAlert: true});

    onHideAlert = () => this.setState({ alert: {} });

    setAlert = (alert/*:AlertMessage*/) => {
        //alert.message = alert.message ? alert.message : this.props.defaultMessage;
        //if(alert.type && _.has(CODES, alert.type)) {
        //    this.setAlert(alert.type, alert.message, alert.closable, alert.reloadable);
        //    // Smoothly scroll to the top of the page
        //    $("html, body").animate({ scrollTop: 0 }, "slow");
        //} else {
        //    console.warn("Cannot display alert message, change object structure to fit alert requirements : ", alert);
        //}
        if(!alert.message) {
            alert.message = this.props.defaultMessage;
        }
        this.setState({ alert : alert });
        if(this.props.autoScroll) {
            // Smoothly scroll to the top of the page
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }

    };

    //setAlert = (type/*:string*/, message/*:string*/, closable/*:boolean*/ = true, reloadable/*:boolean*/ = false) => {
    //    this.setState({ alert: { type: type, message: message, closable: closable, reloadable} });
    //};

    hide = (e) => {
        if(e) {
            e.preventDefault();
        }
        this.setState({ alert: null });
    };

    //canDisplay = () => !_.isEmpty(this.state.alert);
    canClose = () => this.state.alert.closable === true;
    canReload = () => this.state.alert.reloadable === true;

    reloadPage = () => window.location.reload();

    render = () => (
        this.state.alert ?
            <div data-alert className={classnames(this.props.class, this.props.alertClasses[this.state.alert.type], { "closable": this.canClose() })}>
                <div className="alert-content">
                    <div dangerouslySetInnerHTML={{__html: this.state.alert.message }}></div>
                    { this.canClose() ? <a href="#" onClick={this.hide} className="close">&times;</a> : null }
                    { this.canReload() ? <a className="reload-page-link" onClick={this.reloadPage}>{ this.props.reloadMessage }</a> : null }
                </div>
            </div>
         : null
    );

}


// TODO RCH : update prop types
AlertBox.propTypes = {
    class               : React.PropTypes.string,
    alertClasses        : React.PropTypes.object
};

AlertBox.defaultProps = {
    class: "alert-box",
    alertClasses: {
        "DEFAULT"   : "default",
        "SUCCESS"   : "success",
        "INFO"      : "info",
        "WARNING"   : "warning",
        "ERROR"     : "error"
    },
    defaultMessage : "Something went wrong, please call the support.",   // Default error message
    reloadMessage : " Click here to refresh the page",                   // Displayed message for reloadable messages
    translationFn : (restError) => restError.response.error,             // Use this function to auto display an error from backend
    autoScroll : false
};

// Expose AlertBox actions
AlertBox.Actions = AlertBoxActions;

// Expose message configuration
// Each default properties of a message can be overrided
AlertBox.Config = AlertMessage.Config;

module.exports = AlertBox;
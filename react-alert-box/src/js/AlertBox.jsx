const React             = require("react");
const RefluxComponent   = require("../../../lib/react-reflux-component/js/RefluxComponent");
const $                 = require("jquery");
const classnames        = require("classnames");

const AlertBoxActions   = require("./AlertBoxActions");
const AlertMessage      = require("./AlertMessage");
const Config            = require("./Configuration");


/**
 * Display/Hide an alert message.
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
        this.listenToAction(AlertBoxActions.startIgnoreBadRequest,       this.startIgnoreBadRequest);
        this.listenToAction(AlertBoxActions.stopIgnoreBadRequest,        this.stopIgnoreBadRequest);
        this.listenToAction(AlertBoxActions.startIgnoreError,            this.startIgnoreError);
        this.listenToAction(AlertBoxActions.stopIgnoreError,             this.stopIgnoreError);
        this.listenToAction(AlertBoxActions.hideAlert,                   this.onHideAlert);
    }

    initialState = () => ({
        alert: null,
        ignoreBadRequest: false,
        ignoreError: false
    });

    onDisplayRestError = (restError) => {
        // Do not display any message if error is ignored
        if(this.state.ignoreError)
            return;

        switch(restError.status) {
            case 400:
                // Do not display any message if BadRequest is ignored
                if(this.state.ignoreBadRequest)
                    return;

                // Try to translate error to understandable message
                if(restError.response && restError.response.error) {
                    var translatedError = this.props.translationFn(restError) || this.props.defaultMessage;
                    this.onDisplayAlertWarning({ message: translatedError });
                } else {
                    this.onDisplayAlertError({ message: this.props.defaultMessage });
                }
                break;
            case 500:
                if (restError.response && restError.response.error) {
                    var translatedError = _this.props.translationFn(restError) || _this.props.defaultMessage;
                    _this.onDisplayAlertError({ message: translatedError });
                } else {
                    _this.onDisplayAlertError({ message: _this.props.defaultMessage });
                }
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

    startIgnoreBadRequest = () => this.setState({ignoreBadRequest: true});
    stopIgnoreBadRequest = () => this.setState({ignoreBadRequest: false});
    startIgnoreError = () => this.setState({ignoreError: true});
    stopIgnoreError = () => this.setState({ignoreError: false});

    onHideAlert = () => this.setState({ alert: null });

    setAlert = (alert/*:AlertMessage*/) => {
        if(!alert.message) {
            alert.message = this.props.defaultMessage;
        }
        this.setState({ alert : alert });
        if(this.props.autoScroll) {
            // Smoothly scroll to the top of the page
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }
    };

    hide = (e) => {
        if(e) {
            e.preventDefault();
        }
        this.setState({ alert: null });
    };

    canClose = () => this.state.alert.closable === true;
    canReload = () => this.state.alert.reloadable === true;

    reloadPage = () => window.location.reload();

    render = () => (
        this.state.alert ?
            <div data-alert className={classnames(this.props.class, this.props.alertClasses[this.state.alert.type], { "closable": this.canClose() })}>
                <div className="alert-content">
                    { this.state.alert.reactMessage ? this.state.alert.reactMessage :
                        <div dangerouslySetInnerHTML={{__html: this.state.alert.message }}></div>
                    }
                    { this.canReload() ? <a className="reload-page-link" onClick={this.reloadPage}>{ this.props.reloadMessage }</a> : null }
                </div>
                { this.canClose() ? <a href="#" onClick={this.hide} className="alert-box-close">&times;</a> : null }
            </div>
         : null
    );

}

AlertBox.propTypes = {
    class               : React.PropTypes.string,
    alertClasses        : React.PropTypes.object,
    defaultMessage      : React.PropTypes.string,
    reloadMessage       : React.PropTypes.string,
    translationFn       : React.PropTypes.func,
    autoScroll          : React.PropTypes.bool
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
AlertBox.Config = Config;

module.exports = AlertBox;
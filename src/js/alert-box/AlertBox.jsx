import React            from "react";
import PropTypes        from "prop-types";
import $                from "jquery";
import classnames       from "classnames";

import RefluxComponent  from "../reflux/RefluxComponent";
import AlertBoxActions  from "./AlertBoxActions";
import AlertMessage     from "./AlertMessage";
import Config           from "./Configuration";


/**
 * Display/Hide an alert message.
 */
export default class AlertBox extends RefluxComponent {

    static propTypes = {
        class               : PropTypes.string,
        alertClasses        : PropTypes.object,
        defaultMessage      : PropTypes.string,
        reloadMessage       : PropTypes.string,
        translationFn       : PropTypes.func,
        autoScroll          : PropTypes.bool
    };

    static defaultProps = {
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
    static Actions = AlertBoxActions;

    // Expose message configuration
    // Each default properties of a message can be overrided
    static Config = Config;


    constructor(props) {
        super(props);
        this.state = this.initialState();

        this.listenTo(AlertBoxActions.displayRestError,            this.onDisplayRestError);
        this.listenTo(AlertBoxActions.displayAlertError,           this.onDisplayAlertError);
        this.listenTo(AlertBoxActions.displayAlertWarning,         this.onDisplayAlertWarning);
        this.listenTo(AlertBoxActions.displayAlertInfo,            this.onDisplayAlertInfo);
        this.listenTo(AlertBoxActions.displayAlertSuccess,         this.onDisplayAlertSuccess);
        this.listenTo(AlertBoxActions.displayAlertDefault,         this.onDisplayAlertDefault);
        this.listenTo(AlertBoxActions.startIgnoreBadRequest,       this.startIgnoreBadRequest);
        this.listenTo(AlertBoxActions.stopIgnoreBadRequest,        this.stopIgnoreBadRequest);
        this.listenTo(AlertBoxActions.startIgnoreError,            this.startIgnoreError);
        this.listenTo(AlertBoxActions.stopIgnoreError,             this.stopIgnoreError);
        this.listenTo(AlertBoxActions.hideAlert,                   this.onHideAlert);
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

        var translatedError;

        switch(restError.status) {
            case 400:
                // Do not display any message if BadRequest is ignored
                if(this.state.ignoreBadRequest)
                    return;

                // Try to translate error to understandable message
                if(restError.response && restError.response.error) {
                    translatedError = this.props.translationFn(restError) || this.props.defaultMessage;
                    this.onDisplayAlertWarning({ message: translatedError });
                } else {
                    this.onDisplayAlertError({ message: this.props.defaultMessage });
                }
                break;
            case 500:
                if (restError.response && restError.response.error) {
                    translatedError = this.props.translationFn(restError) || this.props.defaultMessage;
                    this.onDisplayAlertError({ message: translatedError });
                } else {
                    this.onDisplayAlertError({ message: this.props.defaultMessage });
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

    render() {
        if(!this.state.alert) { return null; }
        return (
            <div data-alert className={classnames(this.props.class, this.props.alertClasses[this.state.alert.type], { "closable": this.canClose() })}>
                <div className="alert-content">
                    { this.state.alert.reactMessage ? this.state.alert.reactMessage :
                        <div dangerouslySetInnerHTML={{__html: this.state.alert.message }}/>
                    }
                    { this.canReload() ? <a className="reload-page-link" onClick={this.reloadPage}>{ this.props.reloadMessage }</a> : null }
                </div>
                { this.canClose() ? <a href="#" onClick={this.hide} className="alert-box-close">&times;</a> : null }
            </div>
        );
    }

}
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var RefluxComponent = require("../../../lib/react-reflux-component/js/RefluxComponent");
var _ = require("lodash");
var $ = require("jquery");
var classnames = require("classnames");

var AlertBoxActions = require("./AlertBoxActions");
var AlertMessage = require("./AlertMessage");

// TODO RCH : refactor using an 'AlertMessage' class


/**
 * Display/Hide an alert message.
 * This component also handles HTTP failed requests and automatically display an error message according to returned status code.
 *
 * Alert object looks like : { type: "default|success|info|warning|alert", message: "An a message", closable: true|false}
 *
 * This component uses AppActions in order to display/hide error message
 */

var AlertBox = function (_RefluxComponent) {
    _inherits(AlertBox, _RefluxComponent);

    function AlertBox(props) {
        _classCallCheck(this, AlertBox);

        var _this = _possibleConstructorReturn(this, (AlertBox.__proto__ || Object.getPrototypeOf(AlertBox)).call(this, props));

        _this.initialState = function () {
            return {
                alert: null,
                ignoreNextBadRequestAlert: false
            };
        };

        _this.onDisplayRestError = function (restError) {
            switch (restError.status) {
                case 400:
                    // Try to translate error to understandable message
                    if (restError.response && restError.response.error) {
                        if (_this.state.ignoreNextBadRequestAlert) {
                            _this.setState({ ignoreNextBadRequestAlert: false });
                        } else {
                            var translatedError = _this.props.translationFn(restError) || _this.props.defaultMessage;
                            _this.onDisplayAlertWarning({ message: translatedError, reloadable: true });
                        }
                    } else {
                        _this.onDisplayAlertError({ message: _this.props.defaultMessage });
                    }
                    break;
                case 500:
                    _this.onDisplayAlertError({ message: _this.props.defaultMessage });
                    break;
                default: // By default, don't catch other errors to let the power for other components to catch it
            }
        };

        _this.onDisplayAlertError = function () {
            var alert = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return _this.setAlert(AlertMessage.error(alert));
        };

        _this.onDisplayAlertWarning = function () {
            var alert = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return _this.setAlert(AlertMessage.warning(alert));
        };

        _this.onDisplayAlertInfo = function () {
            var alert = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return _this.setAlert(AlertMessage.info(alert));
        };

        _this.onDisplayAlertSuccess = function () {
            var alert = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return _this.setAlert(AlertMessage.success(alert));
        };

        _this.onDisplayAlertDefault = function () {
            var alert = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return _this.setAlert(AlertMessage.default(alert));
        };

        _this.ignoreNextBadRequestAlert = function () {
            return _this.setState({ ignoreNextBadRequestAlert: true });
        };

        _this.onHideAlert = function () {
            return _this.setState({ alert: {} });
        };

        _this.setAlert = function (alert /*:AlertMessage*/) {
            //alert.message = alert.message ? alert.message : this.props.defaultMessage;
            //if(alert.type && _.has(CODES, alert.type)) {
            //    this.setAlert(alert.type, alert.message, alert.closable, alert.reloadable);
            //    // Smoothly scroll to the top of the page
            //    $("html, body").animate({ scrollTop: 0 }, "slow");
            //} else {
            //    console.warn("Cannot display alert message, change object structure to fit alert requirements : ", alert);
            //}
            if (!alert.message) {
                alert.message = _this.props.defaultMessage;
            }
            _this.setState({ alert: alert });
            if (_this.props.autoScroll) {
                // Smoothly scroll to the top of the page
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        };

        _this.hide = function (e) {
            if (e) {
                e.preventDefault();
            }
            _this.setState({ alert: null });
        };

        _this.canClose = function () {
            return _this.state.alert.closable === true;
        };

        _this.canReload = function () {
            return _this.state.alert.reloadable === true;
        };

        _this.reloadPage = function () {
            return window.location.reload();
        };

        _this.render = function () {
            return _this.state.alert ? React.createElement(
                "div",
                { "data-alert": true, className: classnames(_this.props.class, _this.props.alertClasses[_this.state.alert.type], { "closable": _this.canClose() }) },
                React.createElement(
                    "div",
                    { className: "alert-content" },
                    React.createElement("div", { dangerouslySetInnerHTML: { __html: _this.state.alert.message } }),
                    _this.canClose() ? React.createElement(
                        "a",
                        { href: "#", onClick: _this.hide, className: "close" },
                        "×"
                    ) : null,
                    _this.canReload() ? React.createElement(
                        "a",
                        { className: "reload-page-link", onClick: _this.reloadPage },
                        _this.props.reloadMessage
                    ) : null
                )
            ) : null;
        };

        _this.state = _this.initialState();

        _this.listenToAction(AlertBoxActions.displayRestError, _this.onDisplayRestError);
        _this.listenToAction(AlertBoxActions.displayAlertError, _this.onDisplayAlertError);
        _this.listenToAction(AlertBoxActions.displayAlertWarning, _this.onDisplayAlertWarning);
        _this.listenToAction(AlertBoxActions.displayAlertInfo, _this.onDisplayAlertInfo);
        _this.listenToAction(AlertBoxActions.displayAlertSuccess, _this.onDisplayAlertSuccess);
        _this.listenToAction(AlertBoxActions.displayAlertDefault, _this.onDisplayAlertDefault);
        _this.listenToAction(AlertBoxActions.ignoreNextBadRequestAlert, _this.ignoreNextBadRequestAlert);
        _this.listenToAction(AlertBoxActions.hideAlert, _this.onHideAlert);
        return _this;
    }

    /** Helpers functions that builds an alert message **/


    //setAlert = (type/*:string*/, message/*:string*/, closable/*:boolean*/ = true, reloadable/*:boolean*/ = false) => {
    //    this.setState({ alert: { type: type, message: message, closable: closable, reloadable} });
    //};

    //canDisplay = () => !_.isEmpty(this.state.alert);


    return AlertBox;
}(RefluxComponent);

// TODO RCH : update prop types


AlertBox.propTypes = {
    class: React.PropTypes.string,
    alertClasses: React.PropTypes.object
};

AlertBox.defaultProps = {
    class: "alert-box",
    alertClasses: {
        "DEFAULT": "default",
        "SUCCESS": "success",
        "INFO": "info",
        "WARNING": "warning",
        "ERROR": "error"
    },
    defaultMessage: "Something went wrong, please call the support.", // Default error message
    reloadMessage: " Click here to refresh the page", // Displayed message for reloadable messages
    translationFn: function translationFn(restError) {
        return restError.response.error;
    }, // Use this function to auto display an error from backend
    autoScroll: false
};

// Expose AlertBox actions
AlertBox.Actions = AlertBoxActions;

// Expose message configuration
// Each default properties of a message can be overrided
AlertBox.Config = AlertMessage.Config;

module.exports = AlertBox;
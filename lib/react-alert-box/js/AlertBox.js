"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var RefluxComponent = require("../../../lib/react-reflux-component/js/RefluxComponent");
var $ = require("jquery");
var classnames = require("classnames");

var AlertBoxActions = require("./AlertBoxActions");
var AlertMessage = require("./AlertMessage");
var Config = require("./Configuration");

/**
 * Display/Hide an alert message.
 */

var AlertBox = function (_RefluxComponent) {
    _inherits(AlertBox, _RefluxComponent);

    function AlertBox(props) {
        _classCallCheck(this, AlertBox);

        var _this = _possibleConstructorReturn(this, (AlertBox.__proto__ || Object.getPrototypeOf(AlertBox)).call(this, props));

        _this.initialState = function () {
            return {
                alert: null,
                ignoreBadRequest: false,
                ignoreError: false
            };
        };

        _this.onDisplayRestError = function (restError) {
            // Do not display any message if error is ignored
            if (_this.state.ignoreError) return;

            switch (restError.status) {
                case 400:
                    // Do not display any message if BadRequest is ignored
                    if (_this.state.ignoreBadRequest) return;

                    // Try to translate error to understandable message
                    if (restError.response && restError.response.error) {
                        var translatedError = _this.props.translationFn(restError) || _this.props.defaultMessage;
                        _this.onDisplayAlertWarning({ message: translatedError });
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
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this.setAlert(AlertMessage.error(alert));
        };

        _this.onDisplayAlertWarning = function () {
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this.setAlert(AlertMessage.warning(alert));
        };

        _this.onDisplayAlertInfo = function () {
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this.setAlert(AlertMessage.info(alert));
        };

        _this.onDisplayAlertSuccess = function () {
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this.setAlert(AlertMessage.success(alert));
        };

        _this.onDisplayAlertDefault = function () {
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this.setAlert(AlertMessage.default(alert));
        };

        _this.startIgnoreBadRequest = function () {
            return _this.setState({ ignoreBadRequest: true });
        };

        _this.stopIgnoreBadRequest = function () {
            return _this.setState({ ignoreBadRequest: false });
        };

        _this.startIgnoreError = function () {
            return _this.setState({ ignoreError: true });
        };

        _this.stopIgnoreError = function () {
            return _this.setState({ ignoreError: false });
        };

        _this.onHideAlert = function () {
            return _this.setState({ alert: null });
        };

        _this.setAlert = function (alert /*:AlertMessage*/) {
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
                    _this.state.alert.reactMessage ? _this.state.alert.reactMessage : React.createElement("div", { dangerouslySetInnerHTML: { __html: _this.state.alert.message } }),
                    _this.canReload() ? React.createElement(
                        "a",
                        { className: "reload-page-link", onClick: _this.reloadPage },
                        _this.props.reloadMessage
                    ) : null
                ),
                _this.canClose() ? React.createElement(
                    "a",
                    { href: "#", onClick: _this.hide, className: "alert-box-close" },
                    "×"
                ) : null
            ) : null;
        };

        _this.state = _this.initialState();

        _this.listenToAction(AlertBoxActions.displayRestError, _this.onDisplayRestError);
        _this.listenToAction(AlertBoxActions.displayAlertError, _this.onDisplayAlertError);
        _this.listenToAction(AlertBoxActions.displayAlertWarning, _this.onDisplayAlertWarning);
        _this.listenToAction(AlertBoxActions.displayAlertInfo, _this.onDisplayAlertInfo);
        _this.listenToAction(AlertBoxActions.displayAlertSuccess, _this.onDisplayAlertSuccess);
        _this.listenToAction(AlertBoxActions.displayAlertDefault, _this.onDisplayAlertDefault);
        _this.listenToAction(AlertBoxActions.startIgnoreBadRequest, _this.startIgnoreBadRequest);
        _this.listenToAction(AlertBoxActions.stopIgnoreBadRequest, _this.stopIgnoreBadRequest);
        _this.listenToAction(AlertBoxActions.startIgnoreError, _this.startIgnoreError);
        _this.listenToAction(AlertBoxActions.stopIgnoreError, _this.stopIgnoreError);
        _this.listenToAction(AlertBoxActions.hideAlert, _this.onHideAlert);
        return _this;
    }

    /** Helpers functions that builds an alert message **/


    return AlertBox;
}(RefluxComponent);

AlertBox.propTypes = {
    class: React.PropTypes.string,
    alertClasses: React.PropTypes.object,
    defaultMessage: React.PropTypes.string,
    reloadMessage: React.PropTypes.string,
    translationFn: React.PropTypes.func,
    autoScroll: React.PropTypes.bool
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
AlertBox.Config = Config;

module.exports = AlertBox;
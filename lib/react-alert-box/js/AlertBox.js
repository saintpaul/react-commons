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

        var _this2 = _possibleConstructorReturn(this, (AlertBox.__proto__ || Object.getPrototypeOf(AlertBox)).call(this, props));

        _this2.initialState = function () {
            return {
                alert: null,
                ignoreBadRequest: false,
                ignoreError: false
            };
        };

        _this2.onDisplayRestError = function (restError) {
            // Do not display any message if error is ignored
            if (_this2.state.ignoreError) return;

            switch (restError.status) {
                case 400:
                    // Do not display any message if BadRequest is ignored
                    if (_this2.state.ignoreBadRequest) return;

                    // Try to translate error to understandable message
                    if (restError.response && restError.response.error) {
                        var translatedError = _this2.props.translationFn(restError) || _this2.props.defaultMessage;
                        _this2.onDisplayAlertWarning({ message: translatedError });
                    } else {
                        _this2.onDisplayAlertError({ message: _this2.props.defaultMessage });
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

        _this2.onDisplayAlertError = function () {
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this2.setAlert(AlertMessage.error(alert));
        };

        _this2.onDisplayAlertWarning = function () {
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this2.setAlert(AlertMessage.warning(alert));
        };

        _this2.onDisplayAlertInfo = function () {
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this2.setAlert(AlertMessage.info(alert));
        };

        _this2.onDisplayAlertSuccess = function () {
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this2.setAlert(AlertMessage.success(alert));
        };

        _this2.onDisplayAlertDefault = function () {
            var alert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return _this2.setAlert(AlertMessage.default(alert));
        };

        _this2.startIgnoreBadRequest = function () {
            return _this2.setState({ ignoreBadRequest: true });
        };

        _this2.stopIgnoreBadRequest = function () {
            return _this2.setState({ ignoreBadRequest: false });
        };

        _this2.startIgnoreError = function () {
            return _this2.setState({ ignoreError: true });
        };

        _this2.stopIgnoreError = function () {
            return _this2.setState({ ignoreError: false });
        };

        _this2.onHideAlert = function () {
            return _this2.setState({ alert: null });
        };

        _this2.setAlert = function (alert /*:AlertMessage*/) {
            if (!alert.message) {
                alert.message = _this2.props.defaultMessage;
            }
            _this2.setState({ alert: alert });
            if (_this2.props.autoScroll) {
                // Smoothly scroll to the top of the page
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        };

        _this2.hide = function (e) {
            if (e) {
                e.preventDefault();
            }
            _this2.setState({ alert: null });
        };

        _this2.canClose = function () {
            return _this2.state.alert.closable === true;
        };

        _this2.canReload = function () {
            return _this2.state.alert.reloadable === true;
        };

        _this2.reloadPage = function () {
            return window.location.reload();
        };

        _this2.render = function () {
            return _this2.state.alert ? React.createElement(
                "div",
                { "data-alert": true, className: classnames(_this2.props.class, _this2.props.alertClasses[_this2.state.alert.type], { "closable": _this2.canClose() }) },
                React.createElement(
                    "div",
                    { className: "alert-content" },
                    _this2.state.alert.reactMessage ? _this2.state.alert.reactMessage : React.createElement("div", { dangerouslySetInnerHTML: { __html: _this2.state.alert.message } }),
                    _this2.canReload() ? React.createElement(
                        "a",
                        { className: "reload-page-link", onClick: _this2.reloadPage },
                        _this2.props.reloadMessage
                    ) : null
                ),
                _this2.canClose() ? React.createElement(
                    "a",
                    { href: "#", onClick: _this2.hide, className: "alert-box-close" },
                    "\xD7"
                ) : null
            ) : null;
        };

        _this2.state = _this2.initialState();

        _this2.listenToAction(AlertBoxActions.displayRestError, _this2.onDisplayRestError);
        _this2.listenToAction(AlertBoxActions.displayAlertError, _this2.onDisplayAlertError);
        _this2.listenToAction(AlertBoxActions.displayAlertWarning, _this2.onDisplayAlertWarning);
        _this2.listenToAction(AlertBoxActions.displayAlertInfo, _this2.onDisplayAlertInfo);
        _this2.listenToAction(AlertBoxActions.displayAlertSuccess, _this2.onDisplayAlertSuccess);
        _this2.listenToAction(AlertBoxActions.displayAlertDefault, _this2.onDisplayAlertDefault);
        _this2.listenToAction(AlertBoxActions.startIgnoreBadRequest, _this2.startIgnoreBadRequest);
        _this2.listenToAction(AlertBoxActions.stopIgnoreBadRequest, _this2.stopIgnoreBadRequest);
        _this2.listenToAction(AlertBoxActions.startIgnoreError, _this2.startIgnoreError);
        _this2.listenToAction(AlertBoxActions.stopIgnoreError, _this2.stopIgnoreError);
        _this2.listenToAction(AlertBoxActions.hideAlert, _this2.onHideAlert);
        return _this2;
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
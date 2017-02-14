"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var RefluxComponent = require("../../../lib/react-reflux-component/js/RefluxComponent");
var SpinnerActions = require("./SpinnerActions");
var Spin = require("spin.js");

/**
 * Display/Hide a Spinner.
 *
 * This component uses SpinnerActions in order to display/hide the spinner
 */

var Spinner = function (_RefluxComponent) {
    _inherits(Spinner, _RefluxComponent);

    function Spinner(props) {
        _classCallCheck(this, Spinner);

        var _this = _possibleConstructorReturn(this, (Spinner.__proto__ || Object.getPrototypeOf(Spinner)).call(this, props));

        _this.initialState = function () {
            return {
                display: false,
                isRequestTimeout: false,
                message: null,
                showProgress: false,
                progress: 0
            };
        };

        _this.display = function (message, disableTimeout) {
            if (_this.hideTimeout) clearTimeout(_this.hideTimeout);

            if (message) {
                _this.setState({
                    message: message
                });
            }

            if (!_this.state.display) {
                _this.spinner.spin(document.getElementById(_this.props.id));
                _this.setState({ display: true });

                if (_this.isTimeoutEnabled() && !disableTimeout) {
                    _this.requestTimeout = setTimeout(function () {
                        return _this.setState({ isRequestTimeout: true });
                    }, _this.props.timeoutDelay * 1000);
                }
            }
        };

        _this.onMessage = function (message) {
            _this.setState({
                message: message
            });
        };

        _this.onProgress = function (progress, message) {
            _this.setState({
                showProgress: true,
                progress: progress,
                message: message
            });
        };

        _this.hide = function () {
            // Here we use a timeout to avoid flickering issue in case of several sequential http requests
            _this.hideTimeout = setTimeout(function () {
                _this.spinner.stop();
                _this.setState(_this.initialState());

                if (_this.isTimeoutEnabled() && _this.requestTimeout) {
                    clearTimeout(_this.requestTimeout);
                }
            }, 400);
        };

        _this.isTimeoutEnabled = function () {
            return _this.props.timeoutDelay !== 0;
        };

        _this.renderTimeout = function () {
            return React.createElement(
                "div",
                { className: "timeout" },
                React.createElement(
                    "div",
                    null,
                    _this.props.timeoutTitle
                ),
                React.createElement(
                    "div",
                    null,
                    _this.props.timeoutMessage
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "button",
                        { className: _this.props.refreshButtonClass, onClick: function onClick() {
                                return window.location.reload();
                            } },
                        _this.props.refreshButtonTitle
                    )
                )
            );
        };

        _this.renderMessageBox = function () {
            if (_this.state.isRequestTimeout) {
                return null;
            }
            if (_this.state.message || _this.state.showProgress) {
                return React.createElement(
                    "div",
                    { className: "timeout" },
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "h6",
                            null,
                            _this.state.message
                        ),
                        _this.renderProgressBar()
                    )
                );
            }
        };

        _this.renderProgressBar = function () {
            if (_this.state.showProgress) {
                return React.createElement(
                    "div",
                    { className: "progress", style: { width: 250, maxWidth: '100%' } },
                    React.createElement("span", { className: "meter", style: { width: _this.state.progress + '%' } })
                );
            }
        };

        _this.render = function () {
            return React.createElement(
                "div",
                { className: "spinner-container", style: { display: _this.state.display ? 'block' : 'none' } },
                React.createElement("div", { id: _this.props.id }),
                _this.renderMessageBox(),
                _this.state.isRequestTimeout ? _this.renderTimeout() : null
            );
        };

        _this.state = _this.initialState();
        return _this;
    }

    _createClass(Spinner, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            // Create spinner instance
            this.spinner = new Spin({
                lines: 11 // The number of lines to draw
                , length: 20 // The length of each line
                , width: 4 // The line thickness
                , radius: 20 // The radius of the inner circle
                , scale: 1 // Scales overall size of the spinner
                , corners: 1 // Corner roundness (0..1)
                , color: '#000' // #rgb or #rrggbb or array of colors
                , opacity: 0.25 // Opacity of the lines
                , rotate: 0 // The rotation offset
                , direction: 1 // 1: clockwise, -1: counterclockwise
                , speed: 1.3 // Rounds per second
                , trail: 60 // Afterglow percentage
                , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                , zIndex: 2e9 // The z-index (defaults to 2000000000)
                , className: this.props.className // The CSS class to assign to the spinner
                , top: '50%' // Top position relative to parent
                , left: '50%' // Left position relative to parent
                , shadow: true // Whether to render a shadow
                , hwaccel: false // Whether to use hardware acceleration
                , position: 'absolute' // Element positioning
            });

            this.listenToAction(SpinnerActions.displaySpinner, this.display);
            this.listenToAction(SpinnerActions.hideSpinner, this.hide);
            this.listenToAction(SpinnerActions.updateProgress, this.onProgress);
            this.listenToAction(SpinnerActions.updateMessage, this.onMessage);
        }
    }]);

    return Spinner;
}(RefluxComponent);

Spinner.defaultProps = {
    className: "react-spinner",
    id: "spinner",
    timeoutTitle: "It seems that we have a problem...",
    timeoutMessage: "Please check your connection or reload the page.",
    timeoutDelay: 15, // Display a warning message after X seconds. 0 = disabled
    refreshButtonClass: "",
    refreshButtonTitle: "Refresh"
};

Spinner.propTypes = {
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    timeoutTitle: React.PropTypes.string,
    timeoutMessage: React.PropTypes.string,
    timeoutDelay: React.PropTypes.number,
    refreshButtonClass: React.PropTypes.string,
    refreshButtonTitle: React.PropTypes.string
};

// Expose Spinner actions
Spinner.Actions = SpinnerActions;

module.exports = Spinner;
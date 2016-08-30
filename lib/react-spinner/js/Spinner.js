"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
//const RefluxComponent   = require("../../../react-reflux-component/src/js/RefluxComponent");
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

    function Spinner() {
        _classCallCheck(this, Spinner);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Spinner).call(this));

        _this.componentDidMount = function () {
            // Create spinner instance
            _this.spinner = new Spin({
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
                , className: _this.props.className // The CSS class to assign to the spinner
                , top: '50%' // Top position relative to parent
                , left: '50%' // Left position relative to parent
                , shadow: true // Whether to render a shadow
                , hwaccel: false // Whether to use hardware acceleration
                , position: 'absolute' // Element positioning
            });
        };

        _this.display = function () {
            return _this.spinner.spin(_this.refs.spinner);
        };

        _this.hide = function () {
            return _this.spinner.stop();
        };

        _this.render = function () {
            return React.createElement("div", { ref: "spinner" });
        };

        _this.listenToAction(SpinnerActions.displaySpinner, _this.display);
        _this.listenToAction(SpinnerActions.hideSpinner, _this.hide);
        return _this;
    }

    return Spinner;
}(RefluxComponent);

Spinner.defaultProps = {
    className: "spinner"
};

Spinner.propTypes = {
    className: React.PropTypes.string
};

// Expose Spinner actions
Spinner.Actions = SpinnerActions;

module.exports = Spinner;
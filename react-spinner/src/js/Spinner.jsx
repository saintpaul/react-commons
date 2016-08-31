const React             = require("react");
const RefluxComponent   = require("../../../lib/react-reflux-component/js/RefluxComponent");
const SpinnerActions    = require("./SpinnerActions");
const Spin              = require("spin.js");

/**
 * Display/Hide a Spinner.
 *
 * This component uses SpinnerActions in order to display/hide the spinner
 */
class Spinner extends RefluxComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
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
    };

    display = () => this.spinner.spin(document.getElementById(this.props.id));

    hide = () => this.spinner.stop();

    render = () => {
        return <div id={this.props.id}></div>;
    };

}

Spinner.defaultProps = {
    className           : "react-spinner",
    id                  : "spinner"
};

Spinner.propTypes = {
    className           : React.PropTypes.string,
    id                  : React.PropTypes.string
};

// Expose Spinner actions
Spinner.Actions = SpinnerActions;

module.exports = Spinner;
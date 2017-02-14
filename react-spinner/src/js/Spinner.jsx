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

    initialState = () => ({
        display: false,
        isRequestTimeout: false,
        message: null,
        showProgress: false,
        progress: 0
    });

    constructor(props) {
        super(props);
        this.state = this.initialState();
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
        this.listenToAction(SpinnerActions.updateProgress, this.onProgress);
        this.listenToAction(SpinnerActions.updateMessage, this.onMessage);
    }

    display = (message, disableTimeout) => {
        if(this.hideTimeout) clearTimeout(this.hideTimeout);

        if(message){
            this.setState({
                message:message
            });
        }

        if(!this.state.display) {
            this.spinner.spin(document.getElementById(this.props.id));
            this.setState({display: true});

            if(this.isTimeoutEnabled() && !disableTimeout) {
                this.requestTimeout = setTimeout(() => this.setState({isRequestTimeout: true}), this.props.timeoutDelay * 1000);
            }
        }
    };

    onMessage = (message) => {
        this.setState({
            message:message
        })
    }

    onProgress = (progress, message) => {
        this.setState({
            showProgress: true,
            progress: progress,
            message: message
        })
    };

    hide = () => {
        // Here we use a timeout to avoid flickering issue in case of several sequential http requests
        this.hideTimeout = setTimeout( () => {
                this.spinner.stop();
                this.setState(this.initialState());

                if(this.isTimeoutEnabled() && this.requestTimeout) {
                    clearTimeout(this.requestTimeout);
                }
            }, 400);
    };

    isTimeoutEnabled = () => this.props.timeoutDelay !== 0;

    renderTimeout = () => (
        <div className="timeout">
            <div>{ this.props.timeoutTitle }</div>
            <div>{ this.props.timeoutMessage }</div>
            <div>
                <button className={this.props.refreshButtonClass} onClick={() => window.location.reload()}>{this.props.refreshButtonTitle}</button>
            </div>
        </div>
    );

    renderMessageBox = () => {
        if(this.state.isRequestTimeout){
            return null;
        }
        if(this.state.message || this.state.showProgress) {
            return <div className="timeout">
                    <div>
                        <h6>{ this.state.message }</h6>
                        { this.renderProgressBar() }
                    </div>
                </div>

        }
    };

    renderProgressBar = () => {
        if(this.state.showProgress) {
            return <div className="progress" style={{width: 250, maxWidth: '100%'}}>
                <span className="meter" style={{width: this.state.progress + '%'}}/>
            </div>
        }
    }

    render = () => (
        <div className="spinner-container"  style={{display: this.state.display ? 'block':'none'}}>
            <div id={this.props.id}></div>
            { this.renderMessageBox() }
            {this.state.isRequestTimeout ? this.renderTimeout() : null}
        </div>
    );

}

Spinner.defaultProps = {
    className           : "react-spinner",
    id                  : "spinner",
    timeoutTitle        : "It seems that we have a problem...",
    timeoutMessage      : "Please check your connection or reload the page.",
    timeoutDelay        : 15, // Display a warning message after X seconds. 0 = disabled
    refreshButtonClass  : "",
    refreshButtonTitle  : "Refresh"
};

Spinner.propTypes = {
    className           : React.PropTypes.string,
    id                  : React.PropTypes.string,
    timeoutTitle        : React.PropTypes.string,
    timeoutMessage      : React.PropTypes.string,
    timeoutDelay        : React.PropTypes.number,
    refreshButtonClass  : React.PropTypes.string,
    refreshButtonTitle  : React.PropTypes.string
};

// Expose Spinner actions
Spinner.Actions = SpinnerActions;

module.exports = Spinner;
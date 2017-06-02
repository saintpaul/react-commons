import React             from "react";
import PropTypes         from "prop-types";


import Spinner           from "../spinner/Spinner";
import RefluxComponent   from "../reflux/RefluxComponent";
import GlobalSpinnerActions    from "./GlobalSpinnerActions";


/**
 * Display/Hide a GlobalSpinner.
 *
 * This component uses GlobalSpinnerActions in order to display/hide the spinner
 */
export default class GlobalSpinner extends RefluxComponent {

    static defaultProps = {
        className           : "react-spinner",
        id                  : "spinner",
        timeoutTitle        : "It seems that we have a problem...",
        timeoutMessage      : "Please check your connection or reload the page.",
        timeoutDelay        : 15, // Display a warning message after X seconds. 0 = disabled
        refreshButtonClass  : "",
        refreshButtonTitle  : "Refresh"
    };

    static propTypes = {
        className           : PropTypes.string,
        id                  : PropTypes.string,
        timeoutTitle        : PropTypes.string,
        timeoutMessage      : PropTypes.string,
        timeoutDelay        : PropTypes.number,
        refreshButtonClass  : PropTypes.string,
        refreshButtonTitle  : PropTypes.string
    };

    static spinnerConfig = {
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        position: 'absolute' // Element positioning
    };

    // Expose GlobalSpinner actions
    static Actions = GlobalSpinnerActions;

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
        this.listenTo(GlobalSpinnerActions.displaySpinner, this.display);
        this.listenTo(GlobalSpinnerActions.hideSpinner, this.hide);
        this.listenTo(GlobalSpinnerActions.updateProgress, this.onProgress);
        this.listenTo(GlobalSpinnerActions.updateMessage, this.onMessage);
    }

    display = (message, disableTimeout) => {
        if(this.hideTimeout) clearTimeout(this.hideTimeout);

        if(message){
            this.setState({
                message:message
            });
        }

        if(!this.state.display) {
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
    };

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
            return (
                <div className="timeout">
                    <div>
                        <h6>{ this.state.message }</h6>
                        { this.renderProgressBar() }
                    </div>
                </div>
            );
        }
    };

    renderProgressBar = () => {
        if(this.state.showProgress) {
            return (
                <div className="progress" style={{width: 250, maxWidth: '100%'}}>
                    <span className="meter" style={{width: this.state.progress + '%'}}/>
                </div>
            );
        }
    };

    render = () => (
        <div className="spinner-container"  style={{display: this.state.display ? 'block':'none'}}>
            <Spinner config={GlobalSpinner.spinnerConfig} stopped={!this.state.display}/>
            { this.renderMessageBox() }
            {this.state.isRequestTimeout ? this.renderTimeout() : null}
        </div>
    );

}
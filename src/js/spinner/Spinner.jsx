import React from 'react';
import PropTypes from 'prop-types';
import Spin  from "spin.js";


export default class Spinner extends React.Component {

    static propTypes = {
        config    : PropTypes.object,
        stopped   : PropTypes.bool,
        className : PropTypes.string
    };

    static defaultConfig = {
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
        , shadow: true // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'relative' // Element positioning
    };

    componentDidMount() {
        this.spinner = new Spin(this.config);
        if (!this.props.stopped) {
            this.spinner.spin(this.containerRef);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.stopped === true && !this.props.stopped) {
            this.spinner.stop();
        } else if (!newProps.stopped && this.props.stopped === true) {
            this.spinner.spin(this.containerRef);
        }
    }

    componentWillUnmount() {
        this.spinner.stop();
    }

    get config() {
        if(this.props.config || this.props.className) {
            return Object.assign({}, Spinner.defaultConfig, this.props.config, { className : this.props.className });
        } else {
            return Spinner.defaultConfig;
        }
    }

    render() {
        return (
            <span ref={containerRef => this.containerRef = containerRef} />
        );
    }
}
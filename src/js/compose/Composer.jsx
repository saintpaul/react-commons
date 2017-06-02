import React from 'react';
import PropTypes from 'prop-types';

import RefluxComponent from '../reflux/RefluxComponent';


export default class Composer extends RefluxComponent {

    static propTypes = {
        loader : PropTypes.oneOfType([PropTypes.instanceOf(React.Component), PropTypes.func]),
        component : PropTypes.oneOfType([PropTypes.instanceOf(React.Component), PropTypes.func]),
        componentProps : PropTypes.object,
        listenablesMap : PropTypes.object,
        listenablesToPropsMapper : PropTypes.func,
        willMount : PropTypes.func,
        errorHandler : PropTypes.func
    };

    state = {
        listenablesResults: {},
        loadedSteps: [],
        failedSteps: [],
    };

    listenablesMap = {};

    componentWillMount() {
        this.propsKeys.forEach(propKey => {
            const listenable = this.props.listenablesMap[propKey];

            if(listenable.completed) {
                this.listenTo(listenable.completed, value => this.valueReceived(propKey, value));
            } else {
                this.listenTo(listenable, value => this.valueReceived(propKey, value));
            }

            if(listenable.failed) {
                this.listenTo(listenable.failed, value => this.valueReceived(propKey, value));
            }
        });
        this.props.willMount();
    }

    get propsKeys() { return Object.keys(this.props.listenablesMap); }

    get loading() { return this.state.loadedSteps.length !== this.propsKeys.length; }

    get childProps() { return this.props.listenablesToPropsMapper(this.state.listenablesResults); }

    valueReceived(propKey, value) {
        let loadedSteps = this.state.loadedSteps.concat([]);
        if(this.state.loadedSteps.indexOf(propKey) === -1) {
            loadedSteps = loadedSteps.concat(propKey);
        }
        const listenablesResults = Object.assign({}, this.state.listenablesResults, {[propKey] : value});
        this.setState({listenablesResults, loadedSteps});
    }

    failed(propKey, err) {
        if(process.env.NODE_ENV !== 'production') {
            console.error(err);
        }
        this.props.errorHandler(err);
        let failedSteps = this.state.failedSteps.concat([]);
        if(this.state.failedSteps.indexOf(propKey) === -1) {
            failedSteps = failedSteps.concat(propKey);
        }
        this.setState({failedSteps});
    }

    renderLoader() {
        if(!this.props.loader) {
            return null;
        }
        const loaderProps = {
            steps : this.propsKeys,
            loadedSteps : this.state.loadedSteps,
            failedSteps : this.state.failedSteps
        };
        return React.createElement(this.props.loader, loaderProps);
    }

    renderComponent() {
        return React.createElement(this.props.component, {
            ...this.props.componentProps,
            ...this.childProps
        });
    }

    render() {
        return this.loading ? this.renderLoader() : this.renderComponent();
    }
}
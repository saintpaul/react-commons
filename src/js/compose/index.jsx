import React from "react";

import Composer from "./Composer";
import Configuration from "./Configuration";


export default function compose(component, listenablesMap = {}) {

    let composerProps = {
        listenablesMap,
        component,
        listenablesToPropsMapper : res => res,
        willMount : () => {},
        errorHandler : Configuration.defaultErrorHandler
    };

    let defaultProps = {};

    let composed = (props) => {
        const componentProps = {...defaultProps, ...props};
        return (
            <Composer {...composerProps} componentProps={componentProps} />
        );
    };

    composed.withLoader = function(loader = Configuration.defaultLoader) {
        composerProps.loader = loader;
        return composed;
    };

    composed.listenTo = function(listenables) {
        composerProps.listenablesMap = {...composerProps.listenablesMap, ...listenables};
        return composed;
    };

    composed.mapResultsToProps = function(mapper) {
        composerProps.listenablesToPropsMapper = mapper;
        return composed;
    };

    composed.withProps = function(props) {
        defaultProps = {...defaultProps, ...props};
        return composed;
    };

    composed.willMount = function(willMount) {
        composerProps.willMount = willMount;
        return composed;
    };

    composed.onError = function(errorHandler) {
        composerProps.errorHandler = errorHandler;
        return composed;
    };

    return composed;
}
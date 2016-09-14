const $ = require("jquery");
const Configuration = require("./Configuration");

/**
 * Created by bladron on 08/04/16.
 * Utility which allows to not duplicate the code configuration for JQuery ajax call.
 * It is intended to use only JSon for both sent and received data.
 */

class CallAjax {
    static callCount = 0;

    constructor(ajaxQuery) {
        this.ajaxQuery = ajaxQuery;
        CallAjax.callCount++;
        Configuration.showSpinner();
    }

    static _configure = (type, url, data) => {
        let configuration = {
            type: type,
            url: url.toString()
        };

        if(data) {
            configuration.data = JSON.stringify(data);
            configuration.contentType = 'text/json';
        }
        if(Configuration.getAuthToken) {
            configuration.headers = {"X-AUTH-TOKEN": Configuration.getAuthToken()};
            configuration.xhrFields = {withCredentials: true};
        }

        return new CallAjax($.ajax(configuration));
    };

    static get = (url) => CallAjax._configure("GET", url);
    static post = (url, data) => CallAjax._configure("POST", url, data);
    static put = (url, data) => CallAjax._configure("PUT", url, data);
    static delete = (url, data) => CallAjax._configure("DELETE", url, data);

    /**
     * Call several CallAjax in parallel.
     * This method is similair to Promise.all()
     * @param callAjaxList {Array.<CallAjax>}
     * @returns {CallAjax}
     */
    static all = (...callAjaxList) => {
        // Extract ajaxQuery from arguments (array of CallAjax)
        let ajaxQueries = _.map(callAjaxList, (c) => c.ajaxQuery);
        let callThemAll = new CallAjax($.when(...ajaxQueries));
        // Several CallAjax were performed but we're getting only one callback
        // So we need to force callCount to 0 to hide spinner
        callThemAll.done(() => CallAjax.callCount = 0);

        return callThemAll;
    };


    done = (onDone) => {
        this.ajaxQuery.done((data, textStatus/*, jqXHR*/) => {
            CallAjax._decreaseCallCount();
            onDone(data, textStatus);
        });

        return this;
    };

    fail = (onFail) => {
        this.ajaxQuery
            .fail(Configuration.defaultFail)
            .fail((jqXHR, textStatus, errorThrown) => {
                Configuration.displayRestError({status: jqXHR.status, response: {error: textStatus}});
                CallAjax._decreaseCallCount();
                onFail(errorThrown, textStatus);
                if(jqXHR.status === 401)
                    Configuration.requireLogin();
            });

        return this;
    };

    static _decreaseCallCount = () => {
        if(CallAjax.callCount > 0)
            CallAjax.callCount--;

        if(CallAjax.callCount === 0)
            Configuration.hideSpinner();
    };
}

CallAjax.Config = Configuration;

module.exports = CallAjax;

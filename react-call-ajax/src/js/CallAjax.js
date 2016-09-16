const $ = require("jquery");
const Configuration = require("./Configuration");
const _ = require("lodash");

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

    static _configure = (type, url, data, additionalConfig = {}) => {
        let configuration = {
            type: type,
            url: url.toString()
        };

        if(additionalConfig.processData === false) {
            configuration.data = data;
        } else if(data) {
            configuration.data = JSON.stringify(data);
            configuration.contentType = 'text/json';
        }
        if(Configuration.getAuthToken) {
            configuration.headers = {"X-AUTH-TOKEN": Configuration.getAuthToken()};
            configuration.xhrFields = {withCredentials: true};
        }
        configuration = _.merge(configuration, additionalConfig);

        return new CallAjax($.ajax(configuration));
    };

    static get = (url) => CallAjax._configure("GET", url);
    static post = (url, data) => CallAjax._configure("POST", url, data);
    static put = (url, data) => CallAjax._configure("PUT", url, data);
    static delete = (url, data) => CallAjax._configure("DELETE", url, data);
    static uploadFile = (url, data) => CallAjax._configure("POST", url, data, { processData: false });

    /**
     * Call several CallAjax in parallel.
     * This method is similar to Promise.all()
     * @param callAjaxList {Array.<CallAjax>}
     * @returns {CallAjax}
     */
    static all = (...callAjaxList) => {
        // Extract ajaxQuery from arguments (array of CallAjax)
        let ajaxQueries = _.map(callAjaxList, (c) => c.ajaxQuery);
        let callThemAll = new CallAjax($.when(...ajaxQueries));
        // Several CallAjax were performed but we're getting only one callback, so we need to force hide spinner
        callThemAll.always(CallAjax._resetCount);

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
                let error = jqXHR.responseJSON && jqXHR.responseJSON.error;
                Configuration.displayRestError({status: jqXHR.status, response: {error: error}});
                CallAjax._decreaseCallCount();
                onFail(errorThrown, textStatus);
                if(jqXHR.status === 401)
                    Configuration.requireLogin();
            });

        return this;
    };

    always = (onAlways) => {
        this.ajaxQuery.always(() => onAlways());

        return this;
    };

    static _decreaseCallCount = () => {
        if(CallAjax.callCount > 0)
            CallAjax.callCount--;

        if(CallAjax.callCount === 0)
            Configuration.hideSpinner();
    };

    static _resetCount = () => {
        CallAjax.callCount = 0;
        Configuration.hideSpinner();
    };
}

class Batch {

    /**
     * Call several CallAjax by batches of limited size
     * @param callAjaxList {Array.<Function>}
     * @param batchSize {Number} size of each batch
     */
    constructor(callAjaxList, batchSize = 1) {
        // Create a JQuery deferred object (equivalent to Promise) that will wait for all batches to be executed
        this.waitForAll = $.Deferred();
        this.callAjaxList = callAjaxList;
        this.batchSize = batchSize;
        this.succeededCalls = [];
        this.failedCalls = [];
        this.queue = this.initQueue();
        this.processQueue();
    }

    done = (onDone) => {
        this.waitForAll.done(() => onDone(this.succeededCalls));

        return this;
    };

    fail = (onFail) => {
        this.waitForAll.fail(() => {
            onFail(this.failedCalls);
        });

        return this;
    };

    _done = () => {
        CallAjax._resetCount();

        if(this.failedCalls.length > 0)
            this.waitForAll.reject(this.failedCalls);
        else
            this.waitForAll.resolve(this.succeededCalls);
    };

    initQueue = () => _.chunk(this.callAjaxList, this.batchSize);

    processQueue = () => {
        let next = this.queue.shift();
        if(!next){
            this._done();
            return;
        }
        // Call each ajax queries from the current batch in the queue
        let queries = _.map(next, (query) => query().ajaxQuery);

        return $.when(...queries)
            .done((...results) => {
                // jQuery is returning an object instead of an array of result if there is only one query
                if(queries.length === 1)
                    this.succeededCalls.push(results[0]);
                else
                    _.map(results, (r) => this.succeededCalls.push(r[0]));
            })
            .fail( (fail) => this.failedCalls.push(fail) )
            .always( () => this.processQueue() );
    };

}

CallAjax.Config = Configuration;
CallAjax.Batch = Batch;

module.exports = CallAjax;

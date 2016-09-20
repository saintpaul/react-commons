const $ = require("jquery");
const Configuration = require("./Configuration");
const _ = require("lodash");

/**
 * Created by bladron on 08/04/16.
 * Utility which allows to not duplicate the code configuration for JQuery ajax call.
 */

class CallAjax {

    // Number of total calls performed
    static callCount = 0;

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

        // Increase ajax counter
        CallAjax._increaseCallCount();
        // Create jQuery ajax object and attach it some callbacks
        let ajax = $.ajax(configuration);
        CallAjax._attachDefaultFail(ajax);
        CallAjax._attachDefaultAlways(ajax);

        return ajax;
    };

    static get = (url) => CallAjax._configure("GET", url);
    static post = (url, data) => CallAjax._configure("POST", url, data);
    static put = (url, data) => CallAjax._configure("PUT", url, data);
    static delete = (url, data) => CallAjax._configure("DELETE", url, data);
    static uploadFile = (url, data) => CallAjax._configure("POST", url, data, { processData: false });

    /**
     * Call several CallAjax in parallel.
     * This method is similar to Promise.all()
     * @param callAjaxList {Array.<jqXHR>}
     * @returns {jqXHR}
     */
    static all = (...callAjaxList) => {
        let callThemAll = $.when(...callAjaxList);
        // Several CallAjax were performed but we're getting only one callback, so we need to force hide spinner
        callThemAll.always(CallAjax._resetCount);

        return callThemAll;
    };

    /**
     * Attach a default fail() callback.
     * This function will call a default callback from Configuration and automatically display an error.
     * @param ajaxQuery
     * @private
     */
    static _attachDefaultFail = (ajaxQuery) => {
        ajaxQuery.fail((jqXHR, textStatus, errorThrown) => {
            Configuration.defaultFail(jqXHR, textStatus, errorThrown);
            // Build an error message
            let error = jqXHR.responseJSON && jqXHR.responseJSON.error;
            Configuration.displayRestError({status: jqXHR.status, response: {error: error}});
            if(jqXHR.status === 401)
                Configuration.requireLogin();
        });
    };

    /**
     * Attach a default always() callback.
     * This function will decrease total number of call count in order to hide spinner
     * @param ajaxQuery
     * @private
     */
    static _attachDefaultAlways = (ajaxQuery) => ajaxQuery.always(CallAjax._decreaseCallCount);

    static _increaseCallCount = () => {
        CallAjax.callCount++;
        Configuration.showSpinner();
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
        this.waitForAll.fail(() => onFail(this.failedCalls));

        return this;
    };

    _finish = () => {
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
            this._finish();
            return;
        }
        // Call each ajax queries from the current batch in the queue
        let queries = _.map(next, (query) => query());

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

"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = require("jquery");
var Configuration = require("./Configuration");
var _ = require("lodash");

/**
 * Created by bladron on 08/04/16.
 * Utility which allows to not duplicate the code configuration for JQuery ajax call.
 * It is intended to use only JSon for both sent and received data.
 */

var CallAjax = function CallAjax(ajaxQuery) {
    var _this = this;

    _classCallCheck(this, CallAjax);

    this._setDefaultDone = function () {
        return _this.ajaxQuery.done(function () {
            return CallAjax._decreaseCallCount();
        });
    };

    this._setDefaultFail = function () {
        _this.ajaxQuery.fail(function (jqXHR, textStatus, errorThrown) {
            Configuration.defaultFail(jqXHR, textStatus, errorThrown);
            // Build an error message
            var error = jqXHR.responseJSON && jqXHR.responseJSON.error;
            Configuration.displayRestError({ status: jqXHR.status, response: { error: error } });
            // Decrease counter
            CallAjax._decreaseCallCount();
            if (jqXHR.status === 401) Configuration.requireLogin();
        });
    };

    this.done = function (onDone) {
        _this.ajaxQuery.done(function (data, textStatus /*, jqXHR*/) {
            return onDone(data, textStatus);
        });

        return _this;
    };

    this.fail = function (onFail) {
        _this.ajaxQuery.fail(function (jqXHR, textStatus, errorThrown) {
            return onFail(errorThrown, textStatus);
        });

        return _this;
    };

    this.always = function (onAlways) {
        _this.ajaxQuery.always(function () {
            return onAlways();
        });

        return _this;
    };

    this.ajaxQuery = ajaxQuery;
    this._setDefaultDone();
    this._setDefaultFail();
    CallAjax._increaseCallCount();
}

/**
 * Call several CallAjax in parallel.
 * This method is similar to Promise.all()
 * @param callAjaxList {Array.<CallAjax>}
 * @returns {CallAjax}
 */
;

CallAjax.callCount = 0;

CallAjax._configure = function (type, url, data) {
    var additionalConfig = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var configuration = {
        type: type,
        url: url.toString()
    };

    if (additionalConfig.processData === false) {
        configuration.data = data;
    } else if (data) {
        configuration.data = JSON.stringify(data);
        configuration.contentType = 'text/json';
    }
    if (Configuration.getAuthToken) {
        configuration.headers = { "X-AUTH-TOKEN": Configuration.getAuthToken() };
        configuration.xhrFields = { withCredentials: true };
    }
    configuration = _.merge(configuration, additionalConfig);

    return new CallAjax($.ajax(configuration));
};

CallAjax.get = function (url) {
    return CallAjax._configure("GET", url);
};

CallAjax.post = function (url, data) {
    return CallAjax._configure("POST", url, data);
};

CallAjax.put = function (url, data) {
    return CallAjax._configure("PUT", url, data);
};

CallAjax.delete = function (url, data) {
    return CallAjax._configure("DELETE", url, data);
};

CallAjax.uploadFile = function (url, data) {
    return CallAjax._configure("POST", url, data, { processData: false });
};

CallAjax.all = function () {
    for (var _len2 = arguments.length, callAjaxList = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        callAjaxList[_key2] = arguments[_key2];
    }

    // Extract ajaxQuery from arguments (array of CallAjax)
    var ajaxQueries = _.map(callAjaxList, function (c) {
        return c.ajaxQuery;
    });
    var callThemAll = new CallAjax($.when.apply($, _toConsumableArray(ajaxQueries)));
    // Several CallAjax were performed but we're getting only one callback, so we need to force hide spinner
    callThemAll.always(CallAjax._resetCount);

    return callThemAll;
};

CallAjax._increaseCallCount = function () {
    CallAjax.callCount++;
    Configuration.showSpinner();
};

CallAjax._decreaseCallCount = function () {
    if (CallAjax.callCount > 0) CallAjax.callCount--;

    if (CallAjax.callCount === 0) Configuration.hideSpinner();
};

CallAjax._resetCount = function () {
    CallAjax.callCount = 0;
    Configuration.hideSpinner();
};

var Batch =

/**
 * Call several CallAjax by batches of limited size
 * @param callAjaxList {Array.<Function>}
 * @param batchSize {Number} size of each batch
 */
function Batch(callAjaxList) {
    var _this2 = this;

    var batchSize = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

    _classCallCheck(this, Batch);

    this.done = function (onDone) {
        _this2.waitForAll.done(function () {
            return onDone(_this2.succeededCalls);
        });

        return _this2;
    };

    this.fail = function (onFail) {
        _this2.waitForAll.fail(function () {
            onFail(_this2.failedCalls);
        });

        return _this2;
    };

    this._done = function () {
        CallAjax._resetCount();

        if (_this2.failedCalls.length > 0) _this2.waitForAll.reject(_this2.failedCalls);else _this2.waitForAll.resolve(_this2.succeededCalls);
    };

    this.initQueue = function () {
        return _.chunk(_this2.callAjaxList, _this2.batchSize);
    };

    this.processQueue = function () {
        var next = _this2.queue.shift();
        if (!next) {
            _this2._done();
            return;
        }
        // Call each ajax queries from the current batch in the queue
        var queries = _.map(next, function (query) {
            return query().ajaxQuery;
        });

        return $.when.apply($, _toConsumableArray(queries)).done(function () {
            for (var _len = arguments.length, results = Array(_len), _key = 0; _key < _len; _key++) {
                results[_key] = arguments[_key];
            }

            // jQuery is returning an object instead of an array of result if there is only one query
            if (queries.length === 1) _this2.succeededCalls.push(results[0]);else _.map(results, function (r) {
                return _this2.succeededCalls.push(r[0]);
            });
        }).fail(function (fail) {
            return _this2.failedCalls.push(fail);
        }).always(function () {
            return _this2.processQueue();
        });
    };

    // Create a JQuery deferred object (equivalent to Promise) that will wait for all batches to be executed
    this.waitForAll = $.Deferred();
    this.callAjaxList = callAjaxList;
    this.batchSize = batchSize;
    this.succeededCalls = [];
    this.failedCalls = [];
    this.queue = this.initQueue();
    this.processQueue();
};

CallAjax.Config = Configuration;
CallAjax.Batch = Batch;

module.exports = CallAjax;
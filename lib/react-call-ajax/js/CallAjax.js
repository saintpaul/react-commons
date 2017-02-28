"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = require("jquery");
var Configuration = require("./Configuration");
var LodashUtils = require("./LodashUtils");
var _map = require("lodash/map");
var _merge = require("lodash/merge");

/**
 * Created by bladron on 08/04/16.
 * Utility which allows to not duplicate the code configuration for JQuery ajax call.
 */

var CallAjax = function CallAjax() {
    _classCallCheck(this, CallAjax);
};

CallAjax.callCount = 0;
CallAjax.disableSpinner = false;
CallAjax.disableTimeout = false;

CallAjax._configure = function (type, url, data) {
    var additionalConfig = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var configuration = {
        type: type,
        url: url.toString()
    };

    if (additionalConfig.onProgress) {
        // Attach a progress callback to the request
        configuration.xhr = function () {
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) additionalConfig.onProgress(evt);
            }, false);

            return xhr;
        };
    }
    if (additionalConfig.processData === false) {
        configuration.data = data;
    } else if (data) {
        configuration.data = JSON.stringify(data);
        configuration.contentType = 'text/json';
    }
    if (Configuration.getAuthToken) {
        configuration.headers = { "X-AUTH-TOKEN": Configuration.getAuthToken() };
    }
    if (Configuration.withCredentials || Configuration.getAuthToken) {
        configuration.xhrFields = { withCredentials: true };
    }
    configuration = _merge(configuration, additionalConfig);

    if (additionalConfig.disableTimeout) {
        CallAjax.disableTimeout = true;
    }
    // Increase ajax counter
    CallAjax._increaseCallCount();
    // Create jQuery ajax object and attach it some callbacks
    var ajax = $.ajax(configuration);
    CallAjax._attachDefaultFail(ajax);
    CallAjax._attachDefaultAlways(ajax);

    return ajax;
};

CallAjax.bypassSpinner = function () {
    CallAjax.disableSpinner = true;
    return CallAjax;
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

CallAjax.uploadFile = function (url, data, onProgress, disableTimeout) {
    return CallAjax._configure("POST", url, data, { disableTimeout: disableTimeout, processData: false, onProgress: onProgress });
};

CallAjax.all = function () {
    var callThemAll = $.when.apply($, arguments);
    // Several CallAjax were performed but we're getting only one callback, so we need to force hide spinner
    callThemAll.always(CallAjax._resetCount);

    return callThemAll;
};

CallAjax._attachDefaultFail = function (ajaxQuery) {
    ajaxQuery.fail(function (jqXHR, textStatus, errorThrown) {
        Configuration.defaultFail(jqXHR, textStatus, errorThrown);
        // Build an error message
        var error = jqXHR.responseJSON && jqXHR.responseJSON.error;
        Configuration.displayRestError({ status: jqXHR.status, response: { error: error } });
        if (jqXHR.status === 401) Configuration.requireLogin();
    });
};

CallAjax._attachDefaultAlways = function (ajaxQuery) {
    return ajaxQuery.always(CallAjax._decreaseCallCount);
};

CallAjax._increaseCallCount = function () {
    CallAjax.callCount++;
    CallAjax.showSpinner();
};

CallAjax._decreaseCallCount = function () {
    if (CallAjax.callCount > 0) CallAjax.callCount--;

    if (CallAjax.callCount <= 0) CallAjax.hideSpinner();
};

CallAjax._resetCount = function () {
    CallAjax.callCount = 0;
    CallAjax.hideSpinner();
};

CallAjax.showSpinner = function () {
    if (!CallAjax.disableSpinner) Configuration.showSpinner(null, CallAjax.disableTimeout);
};

CallAjax.hideSpinner = function () {
    Configuration.hideSpinner();
    // Reset 'disableSpinner' behavior
    if (CallAjax.disableSpinner) CallAjax.disableSpinner = false;
};

var Batch =

/**
 * Call several CallAjax by batches of limited size
 * @param callAjaxList {Array.<Function>}
 * @param batchSize {Number} size of each batch
 */
function Batch(callAjaxList) {
    var _this = this;

    var batchSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    _classCallCheck(this, Batch);

    this.done = function (onDone) {
        _this.waitForAll.done(function () {
            return onDone(_this.succeededCalls);
        });

        return _this;
    };

    this.fail = function (onFail) {
        _this.waitForAll.fail(function () {
            return onFail(_this.failedCalls);
        });

        return _this;
    };

    this._finish = function () {
        CallAjax._resetCount();

        if (_this.failedCalls.length > 0) _this.waitForAll.reject(_this.failedCalls);else _this.waitForAll.resolve(_this.succeededCalls);
    };

    this.initQueue = function () {
        return LodashUtils.chunk(_this.callAjaxList, _this.batchSize);
    };

    this.processQueue = function () {
        var next = _this.queue.shift();
        if (!next) {
            _this._finish();
            return;
        }
        // Call each ajax queries from the current batch in the queue
        var queries = _map(next, function (query) {
            return query();
        });

        return $.when.apply($, _toConsumableArray(queries)).done(function () {
            for (var _len = arguments.length, results = Array(_len), _key = 0; _key < _len; _key++) {
                results[_key] = arguments[_key];
            }

            // jQuery is returning an object instead of an array of result if there is only one query
            if (queries.length === 1) _this.succeededCalls.push(results[0]);else _map(results, function (r) {
                return _this.succeededCalls.push(r[0]);
            });
        }).fail(function (fail) {
            return _this.failedCalls.push(fail);
        }).always(function () {
            return _this.processQueue();
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
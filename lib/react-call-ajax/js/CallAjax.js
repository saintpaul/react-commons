"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = require("jquery");
var Configuration = require("./Configuration");

/**
 * Created by bladron on 08/04/16.
 * Utility which allows to not duplicate the code configuration for JQuery ajax call.
 * It is intended to use only JSon for both sent and received data.
 */

// TODO RCH : this component need to be customizable to support auth-token (should not be by default)

var CallAjax = function CallAjax(ajaxQuery) {
    var _this = this;

    _classCallCheck(this, CallAjax);

    this.done = function (onDone) {
        _this.ajaxQuery.done(function (data, textStatus /*, jqXHR*/) {
            CallAjax._decreaseCallCount();
            onDone(data, textStatus);
        });

        return _this;
    };

    this.fail = function (onFail) {
        _this.ajaxQuery.fail(Configuration.defaultFail).fail(function (jqXHR, textStatus, errorThrown) {
            Configuration.displayRestError({ status: errorThrown, response: { error: textStatus } });
            CallAjax._decreaseCallCount();
            onFail(errorThrown, textStatus);
            if (jqXHR.status === 401) Configuration.requireLogin();
        });

        return _this;
    };

    this.ajaxQuery = ajaxQuery;
    CallAjax.callCount++;
    Configuration.showSpinner();
}

/**
 * Call several CallAjax in parallel.
 * This method is similair to Promise.all()
 * @param callAjaxList {Array.<CallAjax>}
 * @returns {CallAjax}
 */
;

CallAjax.callCount = 0;

CallAjax._configure = function (type, url, data) {
    var configuration = {
        type: type,
        url: url.toString()
    };

    if (data) {
        configuration.data = JSON.stringify(data);
        configuration.contentType = 'text/json';
    }
    if (Configuration.getAuthToken) {
        configuration.headers = { "X-AUTH-TOKEN": Configuration.getAuthToken() };
        configuration.xhrFields = { withCredentials: true };
    }

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

CallAjax.all = function () {
    for (var _len = arguments.length, callAjaxList = Array(_len), _key = 0; _key < _len; _key++) {
        callAjaxList[_key] = arguments[_key];
    }

    // Extract ajaxQuery from arguments (array of CallAjax)
    var ajaxQueries = _.map(callAjaxList, function (c) {
        return c.ajaxQuery;
    });
    var callThemAll = new CallAjax($.when.apply($, _toConsumableArray(ajaxQueries)));
    // Several CallAjax were performed but we're getting only one callback
    // So we need to force callCount to 0 to hide spinner
    callThemAll.done(function () {
        return CallAjax.callCount = 0;
    });

    return callThemAll;
};

CallAjax._decreaseCallCount = function () {
    if (CallAjax.callCount > 0) CallAjax.callCount--;

    if (CallAjax.callCount === 0) Configuration.hideSpinner();
};

CallAjax.Config = Configuration;

module.exports = CallAjax;
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AlertBox = require("./AlertBox");

var AlertMessage =

/**
 *
 * @param type {String}
 * @param message {String}
 * @param closable {Boolean}
 * @param reloadable {Boolean}
 */
function AlertMessage(type, message, closable, reloadable) {
    _classCallCheck(this, AlertMessage);

    this.type = type;
    this.message = message;
    this.closable = closable;
    this.reloadable = reloadable;
}

// TODO RCH : use _.defaultTo available in lodash 4.15.0
;

AlertMessage.default = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.DEFAULT, alertObject.message, AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.DEFAULT.closable), AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.DEFAULT.reloadable));
};

AlertMessage.success = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.SUCCESS, alertObject.message, AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.SUCCESS.closable), AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.SUCCESS.reloadable));
};

AlertMessage.info = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.INFO, alertObject.message, AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.INFO.closable), AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.INFO.reloadable));
};

AlertMessage.warning = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.WARNING, alertObject.message, AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.WARNING.closable), AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.WARNING.reloadable));
};

AlertMessage.error = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.ERROR, alertObject.message, AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.ERROR.closable), AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.ERROR.reloadable));
};

AlertMessage._getOrElse = function (value, fallback) {
    return value !== undefined ? value : fallback;
};

AlertMessage.TYPES = {
    "DEFAULT": "DEFAULT",
    "SUCCESS": "SUCCESS",
    "INFO": "INFO",
    "WARNING": "WARNING",
    "ERROR": "ERROR"
};

AlertMessage.Config = {
    DEFAULT: {
        closable: true,
        reloadable: false
    },
    SUCCESS: {
        closable: true,
        reloadable: false
    },
    INFO: {
        closable: true,
        reloadable: false
    },
    WARNING: {
        closable: true,
        reloadable: false
    },
    ERROR: {
        closable: true,
        reloadable: false
    }
};

module.exports = AlertMessage;
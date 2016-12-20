"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AlertBox = require("./AlertBox");
var Config = require("./Configuration");

var AlertMessage =

/**
 *
 * @param type {String}
 * @param message {String}
 * @param closable {Boolean}
 * @param reloadable {Boolean}
 * @param reactMessage {String}
 */
function AlertMessage(type, message, closable, reloadable) {
    var reactMessage = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, AlertMessage);

    this.type = type;
    this.message = message;
    this.closable = closable;
    this.reloadable = reloadable;
    this.reactMessage = reactMessage;
}

// TODO RCH : use _.defaultTo available in lodash 4.15.0
;

AlertMessage.default = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.DEFAULT, alertObject.message, AlertMessage._getOrElse(alertObject.closable, Config.DEFAULT.closable), AlertMessage._getOrElse(alertObject.reloadable, Config.DEFAULT.reloadable), alertObject.reactMessage);
};

AlertMessage.success = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.SUCCESS, alertObject.message, AlertMessage._getOrElse(alertObject.closable, Config.SUCCESS.closable), AlertMessage._getOrElse(alertObject.reloadable, Config.SUCCESS.reloadable), alertObject.reactMessage);
};

AlertMessage.info = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.INFO, alertObject.message, AlertMessage._getOrElse(alertObject.closable, Config.INFO.closable), AlertMessage._getOrElse(alertObject.reloadable, Config.INFO.reloadable), alertObject.reactMessage);
};

AlertMessage.warning = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.WARNING, alertObject.message, AlertMessage._getOrElse(alertObject.closable, Config.WARNING.closable), AlertMessage._getOrElse(alertObject.reloadable, Config.WARNING.reloadable), alertObject.reactMessage);
};

AlertMessage.error = function (alertObject) {
    return new AlertMessage(AlertMessage.TYPES.ERROR, alertObject.message, AlertMessage._getOrElse(alertObject.closable, Config.ERROR.closable), AlertMessage._getOrElse(alertObject.reloadable, Config.ERROR.reloadable), alertObject.reactMessage);
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

module.exports = AlertMessage;
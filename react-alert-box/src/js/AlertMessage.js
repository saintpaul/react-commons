const AlertBox = require("./AlertBox");
const Config = require("./Configuration");

class AlertMessage {

    /**
     *
     * @param type {String}
     * @param message {String}
     * @param closable {Boolean}
     * @param reloadable {Boolean}
     * @param reactMessage {String}
     */
    constructor(type, message, closable, reloadable, reactMessage = null) {
        this.type = type;
        this.message = message;
        this.closable = closable;
        this.reloadable = reloadable;
        this.reactMessage = reactMessage;
    }

    static default = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.DEFAULT,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, Config.DEFAULT.closable),
        AlertMessage._getOrElse(alertObject.reloadable, Config.DEFAULT.reloadable),
        alertObject.reactMessage
    );

    static success = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.SUCCESS,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, Config.SUCCESS.closable),
        AlertMessage._getOrElse(alertObject.reloadable, Config.SUCCESS.reloadable),
        alertObject.reactMessage
    );

    static info = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.INFO,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, Config.INFO.closable),
        AlertMessage._getOrElse(alertObject.reloadable, Config.INFO.reloadable),
        alertObject.reactMessage
    );

    static warning = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.WARNING,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, Config.WARNING.closable),
        AlertMessage._getOrElse(alertObject.reloadable, Config.WARNING.reloadable),
        alertObject.reactMessage
    );

    static error = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.ERROR,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, Config.ERROR.closable),
        AlertMessage._getOrElse(alertObject.reloadable, Config.ERROR.reloadable),
        alertObject.reactMessage
    );

    // TODO RCH : use _.defaultTo available in lodash 4.15.0
    static _getOrElse = (value, fallback) => value !== undefined ? value : fallback;

}

AlertMessage.TYPES = {
    "DEFAULT"   : "DEFAULT",
    "SUCCESS"   : "SUCCESS",
    "INFO"      : "INFO",
    "WARNING"   : "WARNING",
    "ERROR"     : "ERROR"
};

module.exports = AlertMessage;
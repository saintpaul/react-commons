const AlertBox = require("./AlertBox");


class AlertMessage {

    /**
     *
     * @param type {String}
     * @param message {String}
     * @param closable {Boolean}
     * @param reloadable {Boolean}
     */
    constructor(type, message, closable, reloadable) {
        this.type = type;
        this.message = message;
        this.closable = closable;
        this.reloadable = reloadable;
    }

    static default = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.DEFAULT,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.DEFAULT.closable),
        AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.DEFAULT.reloadable)
    );

    static success = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.SUCCESS,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.SUCCESS.closable),
        AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.SUCCESS.reloadable)
    );

    static info = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.INFO,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.INFO.closable),
        AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.INFO.reloadable)
    );

    static warning = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.WARNING,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.WARNING.closable),
        AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.WARNING.reloadable)
    );

    static error = (alertObject) => new AlertMessage(
        AlertMessage.TYPES.ERROR,
        alertObject.message,
        AlertMessage._getOrElse(alertObject.closable, AlertMessage.Config.ERROR.closable),
        AlertMessage._getOrElse(alertObject.reloadable, AlertMessage.Config.ERROR.reloadable)
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
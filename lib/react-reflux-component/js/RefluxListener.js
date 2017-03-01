"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This provides some functions to easily listen to Reflux action / store.
 */
var RefluxListener = function () {
    function RefluxListener() {
        _classCallCheck(this, RefluxListener);
    }

    _createClass(RefluxListener, [{
        key: "listenToAction",
        value: function listenToAction(action, callback) {
            this._addAction(action.listen(callback));
        }
    }, {
        key: "listenToStore",
        value: function listenToStore(store, callback) {
            this._addStore(store.listen(callback));
        }
    }, {
        key: "_addAction",
        value: function _addAction(action) {
            var actions = this.actions || [];
            actions.push(action);
            this.actions = actions;
        }
    }, {
        key: "_addStore",
        value: function _addStore(store) {
            var stores = this.stores || [];
            stores.push(store);
            this.stores = stores;
        }
    }, {
        key: "stopListening",
        value: function stopListening() {
            if (this.actions) this.actions.map(function (a) {
                return a();
            });
            if (this.stores) this.stores.map(function (s) {
                return s();
            });
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.stopListening();
        }
    }]);

    return RefluxListener;
}();

module.exports = RefluxListener;
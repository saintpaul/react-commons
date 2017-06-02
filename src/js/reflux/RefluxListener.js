import {ListenerMixin} from "reflux";


/**
 * Reflux listener decorator : apply the ListenerMixin to the target
 * @param target The class to decorate
 * @returns {*}  The decorate class
 */
export default function RefluxListener(target) {

    if(typeof target !== 'function') {
        throw 'RefluxListener decorator should be used only on a class definition.';
    }

    const componentWillUnmount = target.prototype.componentWillUnmount;

    target.prototype.componentWillUnmount = function() {
        if(componentWillUnmount) {
            componentWillUnmount.call(this);
        }
        ListenerMixin.componentWillUnmount.call(this);
    };

    target.prototype.fetchInitialState = function(...args) {
        return ListenerMixin.fetchInitialState.call(this, ...args);
    };

    target.prototype.hasListener = function(...args) {
        return ListenerMixin.hasListener.call(this, ...args);
    };

    target.prototype.joinConcat = function(...args) {
        return ListenerMixin.joinConcat.call(this, ...args);
    };

    target.prototype.joinLeading = function(...args) {
        return ListenerMixin.joinLeading.call(this, ...args);
    };

    target.prototype.joinStrict = function(...args) {
        return ListenerMixin.joinStrict.call(this, ...args);
    };

    target.prototype.joinTrailing = function(...args) {
        return ListenerMixin.joinTrailing.call(this, ...args);
    };

    target.prototype.listenTo = function(...args) {
        return ListenerMixin.listenTo.call(this, ...args);
    };

    target.prototype.listenToMany = function(...args) {
        return ListenerMixin.listenToMany.call(this, ...args);
    };

    target.prototype.stopListeningTo = function(...args) {
        return ListenerMixin.stopListeningTo.call(this, ...args);
    };

    target.prototype.stopListeningToAll = function(...args) {
        return ListenerMixin.stopListeningToAll.call(this, ...args);
    };

    target.prototype.validateListening = function(...args) {
        return ListenerMixin.validateListening.call(this, ...args);
    };

    return target;
}

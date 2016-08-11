/**
 * This provides some functions to easily listen to Reflux action / store.
 */
class RefluxListener {

    listenToAction(action, callback) {
        this._addAction(action.listen(callback));
    }

    listenToStore(store, callback) {
        this._addStore(store.listen(callback));
    }

    _addAction(action) {
        let actions = this.actions || [];
        actions.push(action);
        this.actions = actions;
    }

    _addStore(store) {
        let stores = this.stores || [];
        stores.push(store);
        this.stores = stores;
    }

    stopListening() {
        if (this.actions) this.actions.map(a => a());
        if (this.stores) this.stores.map(s => s());
    }

    componentWillUnmount() {
        this.stopListening();
    }
}

module.exports = RefluxListener;
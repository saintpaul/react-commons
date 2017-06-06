import Configuration from "./Configuration";


class RequestsExecutor {

    pendingCalls = [];

    get pendingCallsWithSpinner() {
        return this.pendingCalls.filter(c => !c.spinnerDisabled).length;
    }

    _requestDone(call) {
        this.pendingCalls = this.pendingCalls.filter(c => c !== call);
        if(this.pendingCallsWithSpinner === 0) {
            this._hideSpinner();
        }
    }

    _showSpinner(timeoutDisabled) {
        Configuration.showSpinner(null, timeoutDisabled);
    }

    _hideSpinner() {
        Configuration.hideSpinner();
    }

    execute(request, spinnerDisabled = false, timeoutDisabled = false) {

        if(!spinnerDisabled) {
            this._showSpinner(spinnerDisabled, timeoutDisabled);
        }

        const call = {
            request,
            spinnerDisabled,
            timeoutDisabled
        };

        this.pendingCalls.push(call);

        return new Promise((resolve, reject) => {
            request().then((...args) => {
                this._requestDone(call);
                resolve(...args);
            }).catch((...args) => {
                this._requestDone(call);
                reject(...args);
            })
        });
    }
}

export default new RequestsExecutor();
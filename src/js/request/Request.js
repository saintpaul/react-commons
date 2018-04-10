import Configuration from "./Configuration";
import RequestsExecutor from "./RequestsExecutor";
import LodashUtils from "./LodashUtils";


class Request {

    // Alias for Configuration object
    Config = Configuration;

    /**
     * Build a new Request with options `forceOptions`
     * @param forceOptions object with not mandatory options (spinnerDisabled, timeoutDisabled, withCredentials, timeoutDuration)
     */
    constructor(forceOptions = {}) {
        this.forceOptions = forceOptions;
    }

    getOptions() {
        return {
            spinnerDisabled: this.forceOptions.spinnerDisabled !== undefined ? this.forceOptions.spinnerDisabled : false,
            timeoutDisabled: this.forceOptions.timeoutDisabled !== undefined ? this.forceOptions.timeoutDisabled : false,
            withCredentials: this.forceOptions.withCredentials !== undefined ? this.forceOptions.withCredentials : this.Config.withCredentials,
            timeoutDuration: this.forceOptions.timeoutDuration !== undefined ? this.forceOptions.timeoutDuration : undefined,
            getAuthToken : this.Config.getAuthToken,
            defaultFail: this.Config.defaultFail,
            displayRestError: this.Config.displayRestError,
            requireLogin: this.Config.requireLogin
        }
    }

    disableSpinner() {
        return new Request({ spinnerDisabled: true });
    }

    disableTimeout() {
        return new Request({ timeoutDisabled: true });
    }

    enableSpinner() {
        return new Request({ spinnerDisabled: false });
    }

    enableTimeout() {
        return new Request({ timeoutDisabled: false });
    }

    disableWithCredentials() {
        return new Request({ withCredentials: false });
    }

    enableWithCredentials() {
        return new Request({ withCredentials: true });
    }

    /**
     * Set a timeout on the Promise. If timeout is reached, promise will be rejected.
     * Do not misunderstood with `enableTimeout()` which enable a timeout for spinner
     * @param duration (ms)
     * @returns {Request}
     */
    setTimeOut(duration) {
        return new Request({ timeoutDuration: duration });
    }

    _doJsonRequest(url, method, body) {

        let options = {
            method,
            headers : {}
        };

        if(body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        if(this.getOptions().getAuthToken) {
            options.headers['X-AUTH-TOKEN'] = this.getOptions().getAuthToken();
        }

        if(this.getOptions().withCredentials || this.getOptions().getAuthToken) {
            options.credentials = 'include';
        }

        const request = () => {
            return new Promise((resolve, _reject) => {

                const reject = (...args) => {
                    this._defaultFailed(...args);
                    _reject(...args);
                };

                const _handleResponse = (response, json) => {
                    if(response.ok) {
                        resolve(json);
                    } else {
                        // Give back full response object + json in case of response different from 2xx
                        reject({response, json});
                    }
                };

                // Handle timeout (if timeout is enabled)
                let didTimeOut = false,
                    timeOut;

                if(this.getOptions().timeoutDuration) {
                    timeOut = setTimeout(() => {
                        // If was fallback here, it means we've reached timeout, so we reject the promise
                        didTimeOut = true;
                        reject(new Error(`Request timed out, promise took longer than ${this.getOptions().timeoutDuration}ms`))
                    }, this.getOptions().timeoutDuration);
                }

                fetch(url, options).then(response => {

                    try {

                        response.json().then(json => {
                            if(this.getOptions().timeoutDuration) {
                                clearTimeout(timeOut);
                                // Process response if timeout wasn't reached
                                if(!didTimeOut) {
                                    _handleResponse(response, json)
                                }
                            } else {
                                _handleResponse(response, json);
                            }
                        }).catch(e => {
                            if(this.getOptions().timeoutDuration)
                                return;

                            // If response is okay but cannot be converted to JSON, resolve the promise anyway
                            if(response.ok) {
                                resolve();
                            } else {
                                reject(response, null, e);
                            }
                        });

                    } catch(e) {
                        reject(null, null, e);
                    }

                }).catch(e => {
                    reject(null, null, e);
                });
            });
        };

        return RequestsExecutor.execute(request, this.getOptions().spinnerDisabled, this.getOptions().timeoutDisabled);
    }

    _defaultFailed(response, json, errorThrown) {
        this.getOptions().defaultFail(response, json, errorThrown);
        // Build an error message
        const error = json && json.error;
        const args = (json && json.args) || {};
        const status = (response && response.status) || 404;
        this.getOptions().displayRestError({status, response: {error, args}});
        if(status === 401) {
            this.getOptions().requireLogin();
        }
    }

    get(url) {
        return this._doJsonRequest(url, 'GET', null);
    }

    post(url, body) {
        return this._doJsonRequest(url, 'POST', body);
    }

    put(url, body) {
        return this._doJsonRequest(url, 'PUT', body);
    }

    delete(url, body) {
        return this._doJsonRequest(url, 'DELETE', body);
    }

    all(...requestSuppliers) {
        return Promise.all(requestSuppliers.map(rs => rs()));
    }

    batch(requestSuppliers, batchSize = 10) {

        const requestsBatches = LodashUtils.chunk(requestSuppliers, batchSize);
        let results = [];

        const executeBatch = (resolve, reject, batchIndex = 0) => {

            if(requestsBatches.length > batchIndex) {

                this.all(...requestsBatches[batchIndex]).then(res => {
                    results.push(...res);
                    executeBatch(resolve, reject, batchIndex + 1);
                }).catch(e => reject(e));

            } else {
                resolve(results);
            }
        };

        return new Promise((resolve, reject) => executeBatch(resolve, reject));
    }

    /**
     * Note : fetch doesn't support progress listener, so we use XMLHttpRequest for file upload
     */
    uploadFile(url, data, fileName, onProgress, contentType, method = 'POST') {

        const request = () => {
            return new Promise((resolve, _reject) => {

                const reject = (...args) => {
                    this._defaultFailed(...args);
                    _reject(...args);
                };

                let xhr = new XMLHttpRequest();

                xhr.addEventListener('load', () => {

                    let json, error;

                    try {
                        json = JSON.parse(xhr.responseText);
                    } catch (e) {
                        error = e;
                    }

                    if(!error && xhr.status >= 200 && xhr.status < 400) {
                        resolve(json);
                    } else {
                        reject(xhr, json, error);
                    }
                }, false);

                xhr.addEventListener('error', e => {
                    reject(null, null, e);
                }, false);

                xhr.addEventListener('abort', e => {
                    reject(null, null, e);
                }, false);

                if(onProgress) {
                    xhr.addEventListener('progress', (event) => onProgress(event), false);
                }

                xhr.open(method, url);

                if(this.getOptions().getAuthToken) {
                    xhr.setRequestHeader('X-AUTH-TOKEN', this.getOptions().getAuthToken());
                }

                if(this.getOptions().withCredentials || this.getOptions().getAuthToken) {
                    xhr.withCredentials = true;
                }

                if(contentType) {
                    xhr.setRequestHeader("Content-Type", contentType);
                }

                if(fileName) {
                    xhr.setRequestHeader("Content-Disposition", `attachment; filename="${fileName}"`);
                }

                xhr.send(data);
            });
        };

        return RequestsExecutor.execute(request, this.getOptions().spinnerDisabled, this.getOptions().timeoutDisabled);
    }
}

export default new Request();
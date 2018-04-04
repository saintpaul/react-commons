import Configuration from "./Configuration";
import RequestsExecutor from "./RequestsExecutor";
import LodashUtils from "./LodashUtils";


class Request {

    Config = Configuration;
    
    constructor(forceOptions = {}) {
        this.forceOptions = {
            spinnerDisabled: forceOptions.spinnerDisabled !== undefined ? forceOptions.spinnerDisabled : false,
            timeoutDisabled: forceOptions.timeoutDisabled !== undefined ? forceOptions.timeoutDisabled : false,
            withCredentials: forceOptions.withCredentials !== undefined ? forceOptions.withCredentials : this.Config.withCredentials
        };
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

    _doJsonRequest(url, method, body) {

        let options = {
            method,
            headers : {}
        };

        if(body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        if(Configuration.getAuthToken) {
            options.headers['X-AUTH-TOKEN'] = Configuration.getAuthToken();
        }

        if(this.forceOptions.withCredentials || Configuration.getAuthToken) {
            options.credentials = 'include';
        }

        const request = () => {
            return new Promise((resolve, _reject) => {

                const reject = (...args) => {
                    this._defaultFailed(...args);
                    _reject(...args);
                };

                fetch(url, options).then(response => {

                    try {

                        response.json().then(json => {
                            if(response.ok) {
                                resolve(json)
                            } else {
                                // Give back full response object + json in case of response different from 2xx
                                reject({response, json});
                            }
                        }).catch(e => {
                            // If response is okay but cannot be converted to JSON, resolve the promise anyway
                            if(response.ok) {
                                resolve()
                            } else {
                                reject(response, null, e)
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

        return RequestsExecutor.execute(request, this.forceOptions.spinnerDisabled, this.forceOptions.timeoutDisabled);
    }

    _defaultFailed(response, json, errorThrown) {
        Configuration.defaultFail(response, json, errorThrown);
        // Build an error message
        const error = json && json.error;
        const args = (json && json.args) || {};
        const status = (response && response.status) || 404;
        Configuration.displayRestError({status, response: {error, args}});
        if(status === 401) {
            Configuration.requireLogin();
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

                if(Configuration.getAuthToken) {
                    xhr.setRequestHeader('X-AUTH-TOKEN', Configuration.getAuthToken());
                }

                if(this.withCredentials || Configuration.getAuthToken) {
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

        return RequestsExecutor.execute(request, this.forceOptions.spinnerDisabled, this.forceOptions.timeoutDisabled);
    }
}

export default new Request();
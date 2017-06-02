import Reflux from 'reflux';


export default {
    displaySpinner          : Reflux.createAction({asyncResult: true}),
    hideSpinner             : Reflux.createAction({asyncResult: true}),
    updateMessage           : Reflux.createAction(),
    updateProgress          : Reflux.createAction(),
};

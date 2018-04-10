import GlobalSpinner from "../global-spinner/GlobalSpinner";
import AlertBox from "../alert-box/AlertBox";

export default {
    showSpinner: GlobalSpinner.Actions.displaySpinner,
    hideSpinner: GlobalSpinner.Actions.hideSpinner,
    displayRestError: AlertBox.Actions.displayRestError,
    withCredentials: undefined,     // Special XHR header to add if authentication is needed (and pass cookies)
    getAuthToken: undefined,        // Function to call when auth-token is needed
    requireLogin: () => {},         // Function that will be called in case of Unauthorized response
    defaultFail: () => {}           // Default function called when any request failed
};
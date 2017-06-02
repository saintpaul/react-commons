import Spinner from "../spinner/Spinner";
import AlertBox from "../alert-box/AlertBox";

export default {
    defaultErrorHandler: AlertBox.Actions.isplayAlertError, // Function that will be called in case of action failure
    defaultLoader: Spinner                                  // Default loader
};
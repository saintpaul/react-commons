const React = require('react');
const { Spinner } = require('./index');


class DemoSpinner extends React.Component {

    constructor(props) {
        super(props);
    }

    displaySpinner = () => Spinner.Actions.displaySpinner();
    hideSpinner = () => Spinner.Actions.hideSpinner();

    render = () => (
        <div>
            <h1>Demo react-spinner</h1>
            <Spinner timeoutDelay={3}/>
            <button onClick={this.displaySpinner}>Display spinner</button>
            <button onClick={this.hideSpinner}>Hide spinner</button>
        </div>
    );
}

module.exports = DemoSpinner;
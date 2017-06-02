import React from 'react';

import { GlobalSpinner } from '../src';


export default class DemoGlobalSpinner extends React.Component {

    displaySpinner = () => GlobalSpinner.Actions.displaySpinner();
    hideSpinner = () => GlobalSpinner.Actions.hideSpinner();

    render = () => (
        <div>
            <h1>Demo spinner</h1>
            <GlobalSpinner timeoutDelay={3}/>
            <button onClick={this.displaySpinner}>Display spinner</button>
            <button onClick={this.hideSpinner}>Hide spinner</button>
        </div>
    );
}
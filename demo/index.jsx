import React from 'react';
import ReactDom from 'react-dom';

import DemoCallAjax from "./DemoCallAjax";
import DemoSpinner from "./DemoSpinner";
import DemoRefluxComponent from "./DemoRefluxComponent";
import DemoAlertBox from "./DemoAlertBox";

// styles
require('./main.scss');

const Demo = () => (
    <div>
        <DemoRefluxComponent/>
        <DemoSpinner/>
        <DemoAlertBox/>
        <DemoCallAjax/>
    </div>
);

ReactDom.render(<Demo/>, document.getElementById('app'));

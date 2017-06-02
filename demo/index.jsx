import React from 'react';
import ReactDom from 'react-dom';

import DemoCallAjax from "./DemoCallAjax";
import DemoGlobalSpinner from "./DemoGlobalSpinner";
import DemoRefluxComponent from "./DemoRefluxComponent";
import DemoAlertBox from "./DemoAlertBox";
import DemoComposer from "./DemoComposer";

// styles
require('./main.scss');

const Demo = () => (
    <div>
        <DemoRefluxComponent/>
        <DemoGlobalSpinner/>
        <DemoAlertBox/>
        <DemoCallAjax/>
        <DemoComposer/>
    </div>
);

ReactDom.render(<Demo/>, document.getElementById('app'));

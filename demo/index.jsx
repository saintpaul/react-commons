const React = require('react');
const ReactDom = require('react-dom');

const DemoCallAjax = require("./DemoCallAjax");
const DemoSpinner = require("./DemoSpinner");
const DemoRefluxComponent = require("./DemoRefluxComponent");
const DemoAlertBox = require("./DemoAlertBox");

// styles
require('./main.scss');

const Demo = (
    <div>
        <DemoRefluxComponent/>
        <DemoSpinner/>
        <DemoAlertBox/>
        <DemoCallAjax/>
    </div>
);

ReactDom.render(Demo, document.getElementById('app'));

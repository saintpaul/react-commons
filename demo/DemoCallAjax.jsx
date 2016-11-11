const React = require('react');
const { CallAjax } = require('./index');
const { Spinner } = require('../lib');

const BATCH_SIZE = 2;

class DemoCallAjax extends React.Component {
    initialState = () => ({
        movieInput: "",
        movieResult: undefined,
        batchResults: []
    });

    constructor(props) {
        super(props);
        this.state = this.initialState();
    }

    _getMoviesCall = (movie) => CallAjax.get("http://www.omdbapi.com/?t=" + movie+ "&y=&plot=short&r=json");
    _getMoviesCallWithoutSpinner = (movie) => CallAjax.bypassSpinner().get("http://www.omdbapi.com/?t=" + movie+ "&y=&plot=short&r=json");

    onChangeMovieInput = (event) => this.setState({movieInput: event.target.value});

    onClickGetMovie = () => this._getMoviesCall(this.state.movieInput).done( (json) => this.setState({movieResult: json}) );
    onClickGetMovieWithoutSpinner = () => this._getMoviesCallWithoutSpinner(this.state.movieInput).done( (json) => this.setState({movieResult: json}) );

    onClickBatch = () => {
        let calls = [
            () => this._getMoviesCall("Pulp Fiction"),
            () => this._getMoviesCall("Fight Club"),
            () => this._getMoviesCall("The Truman Show"),
            () => this._getMoviesCall("The Pick of Destiny"),
            () => this._getMoviesCall("Star Wars")
        ];
        new CallAjax.Batch(calls, BATCH_SIZE).done( (results) => this.setState({ batchResults: results }) );
    };

    renderBatchResults = () => (
        <div>
            { this.state.batchResults.map( (r) => JSON.stringify(r) ) }
        </div>
    );

    render = () => (
        <div>
            <Spinner id="demo-call-ajax-spinner"/>
            <h1>Demo CallAjax</h1>
            <input onChange={this.onChangeMovieInput} value={this.state.movieInput}/>
            <button onClick={this.onClickGetMovie}>GET movie informations</button>
            <button onClick={this.onClickGetMovieWithoutSpinner}>GET movie informations (no spinner)</button>
            <br/>
            {JSON.stringify(this.state.movieResult)}
            <br/>

            Send several request in batches of size {BATCH_SIZE} :
            <button onClick={this.onClickBatch}>BATCH</button>
            { this.renderBatchResults() }
        </div>
    );
}

module.exports = DemoCallAjax;
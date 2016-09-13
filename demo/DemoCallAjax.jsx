const React = require('react');
const { CallAjax } = require('./index');

class DemoCallAjax extends React.Component {
    initialState = () => ({
        movieInput: "",
        movieResult: undefined
    });

    constructor(props) {
        super(props);
        this.state = this.initialState();
    }

    onChangeMovieInput = (event) => this.setState({movieInput: event.target.value});

    onGetMovieInfos = () => {
        const url = "http://www.omdbapi.com/?t=" + this.state.movieInput + "&y=&plot=short&r=json";
        CallAjax.get(url).done((json) => this.setState({movieResult: json}));
    };

    render = () => (
        <div>
            <h1>Demo CallAjax</h1>
            <input onChange={this.onChangeMovieInput} value={this.state.movieInput}></input>
            <button onClick={this.onGetMovieInfos}>GET movie informations</button>
            <br/>
            {JSON.stringify(this.state.movieResult)}
        </div>
    );
}

module.exports = DemoCallAjax;
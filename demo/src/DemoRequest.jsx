import React from 'react';

import { Request } from '../../src';
import { GlobalSpinner } from '../../src';

const BATCH_SIZE = 2;

const apiUrl = '/server';


export default class DemoRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState();
    }

    initialState = () => ({
        pokemonInput: "Alakazam",
        pokemonResult: undefined,
        batchResults: []
    });

    getPokemonApiUrl(pokemon) {
        return `${apiUrl}/pokemon/${pokemon}`;
    }

    _getPokemonsCall = (pokemon) => Request.get(this.getPokemonApiUrl(pokemon));
    _getPokemonsCallWithoutSpinner = (pokemon) => Request.disableSpinner().get(this.getPokemonApiUrl(pokemon));

    triggerBadRequest() { Request.get(`${apiUrl}/bad-request`); }

    triggerBadRequestWithMessage() { Request.get(`${apiUrl}/bad-request/with-message`); }

    triggerInternalServerError() { Request.get(`${apiUrl}/internal-server-error`); }

    triggerUnauthorized() { Request.get(`${apiUrl}/unauthorized`); }

    triggerNoResponse() { Request.get(`${apiUrl}/no-response`); }

    onChangePokemonInput = (event) => this.setState({pokemonInput: event.target.value});

    onClickGetPokemon = () => {
        if(this.state.pokemonInput && this.state.pokemonInput.length > 0) {
            this._getPokemonsCall(this.state.pokemonInput).then(pokemonResult => this.setState({pokemonResult}));
        }
    };

    onClickGetPokemonWithoutSpinner = () => {
        if(this.state.pokemonInput && this.state.pokemonInput.length > 0) {
            this._getPokemonsCallWithoutSpinner(this.state.pokemonInput).then(pokemonResult => this.setState({pokemonResult}));
        }
    };

    onClickBatch = () => {
        let calls = [
            () => this._getPokemonsCall("Charmander"),
            () => this._getPokemonsCall("Rattata"),
            () => this._getPokemonsCall("Psyduck"),
            () => this._getPokemonsCall("Magmar"),
            () => this._getPokemonsCall("Pikachu")
        ];
        Request.batch(calls, BATCH_SIZE).then(batchResults => this.setState({ batchResults }));
    };

    onUpload = (e) => {
        if(e.target.files.length > 0) {
            Request.uploadFile(`${apiUrl}/upload`, e.target.files[0], e.target.value, (event, percent) => {
                console.log('Upload progress event', event);
                console.log('Upload progress percent', percent);
            });
        }
    };

    onUploadWithFailure = (e) => {
        if(e.target.files.length > 0) {
            Request.uploadFile(`${apiUrl}/not-found`, e.target.files[0]);
        }
    };

    renderPokemon(p) {
        const style = {
            backgroundColor: "#ccc",
            border : "1px solid black",
            margin: "0.5em 0.5em 0.5em 0",
            padding: "0.25em",
            display: "inline-block"
        };
        return (
            <div key={p.id} style={ style }>
                <div>Name : {p.name}</div>
                <div>Power : {p.power}</div>
            </div>
        )
    }

    render = () => (
        <div>
            <GlobalSpinner id="demo-call-ajax-spinner"/>
            <h1>Demo Request</h1>
            <input onChange={this.onChangePokemonInput} value={this.state.pokemonInput}/>
            <button onClick={this.onClickGetPokemon}>
                GET pokemon informations
            </button>
            <button onClick={this.onClickGetPokemonWithoutSpinner}>
                GET pokemon informations (no spinner)
            </button>
            <br/>
            {this.state.pokemonResult ? this.renderPokemon(this.state.pokemonResult) : null}
            <br/>
            Send several request in batches of size {BATCH_SIZE} :
            <button onClick={this.onClickBatch}>BATCH</button>
            <div>
                { this.state.batchResults.map(p => this.renderPokemon(p)) }
            </div>
            <br/>
            <button onClick={this.triggerBadRequest}>
                Bad request
            </button>
            <button onClick={this.triggerBadRequestWithMessage}>
                Bad request (with message from the back-end)
            </button>
            <button onClick={this.triggerInternalServerError}>
                Internal Server Error
            </button>
            <button onClick={this.triggerUnauthorized}>
                Unauthorized
            </button>
            <button onClick={this.triggerNoResponse}>
                No response
            </button>
            <br/>
            <div>
                Upload (see progress in console) :
                <input type="file" onChange={this.onUpload} />
            </div>
            <div>
                Upload with failure :
                <input type="file" onChange={this.onUploadWithFailure} />
            </div>
        </div>
    );
}
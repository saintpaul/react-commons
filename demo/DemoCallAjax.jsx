import React from 'react';

import { CallAjax } from '../src';
import { GlobalSpinner } from '../src';

const BATCH_SIZE = 2;

export default class DemoCallAjax extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState();
    }

    initialState = () => ({
        pokemonInput: "",
        pokemonResult: undefined,
        batchResults: []
    });

    getPokemonApiUrl(pokemon) {
        return `http://pokeapi.co/api/v2/pokemon/${pokemon}`;
    }

    _getPokemonsCall = (pokemon) => CallAjax.get(this.getPokemonApiUrl(pokemon));
    _getPokemonsCallWithoutSpinner = (pokemon) => CallAjax.bypassSpinner().get(this.getPokemonApiUrl(pokemon));

    onChangePokemonInput = (event) => this.setState({pokemonInput: event.target.value});

    onClickGetPokemon = () => {
        if(this.state.pokemonInput && this.state.pokemonInput.length > 0) {
            this._getPokemonsCall(this.state.pokemonInput).done( (json) => this.setState({pokemonResult: json}) );
        }
    };

    onClickGetPokemonWithoutSpinner = () => {
        if(this.state.pokemonInput && this.state.pokemonInput.length > 0) {
            this._getPokemonsCallWithoutSpinner(this.state.pokemonInput).done((json) => this.setState({pokemonResult: json}));
        }
    };

    onClickBatch = () => {
        let calls = [
            () => this._getPokemonsCall("charmander"),
            () => this._getPokemonsCall("rattata"),
            () => this._getPokemonsCall("psyduck"),
            () => this._getPokemonsCall("magmar"),
            () => this._getPokemonsCall("pikachu")
        ];
        new CallAjax.Batch(calls, BATCH_SIZE).done( (results) => this.setState({ batchResults: results }) );
    };

    renderPokemon(p) {
        return (
            <div key={p.id} style={ { textAlign: "center", display: "inline-block" } }>
                <div>{p.name}</div>
                <img src={p.sprites.front_default}/>
            </div>
        )
    }

    render = () => (
        <div>
            <GlobalSpinner id="demo-call-ajax-spinner"/>
            <h1>Demo CallAjax</h1>
            <input onChange={this.onChangePokemonInput} value={this.state.pokemonInput}/>
            <button onClick={this.onClickGetPokemon}>GET pokemon informations</button>
            <button onClick={this.onClickGetPokemonWithoutSpinner}>GET pokemon informations (no spinner)</button>
            <br/>
            {this.state.pokemonResult ? this.renderPokemon(this.state.pokemonResult) : null}
            <br/>

            Send several request in batches of size {BATCH_SIZE} :
            <button onClick={this.onClickBatch}>BATCH</button>
            <div>
                { this.state.batchResults.map(p => this.renderPokemon(p)) }
            </div>
        </div>
    );
}
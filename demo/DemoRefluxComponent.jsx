import React from 'react';
import Reflux from 'reflux';

import { RefluxComponent } from '../src';

const CharacterActions = {
    createCharacter: Reflux.createAction(),
    fightCharacter: Reflux.createAction()
};

class CharacterStoreClass extends Reflux.Store {

    constructor() {
        super();
        this.characters = [];
        this.listenTo(CharacterActions.createCharacter, this.addCharacter);
    }

    addCharacter = (character) => {
        this.characters.push(character);
        this.trigger(character);
    };
}

const CharacterStore = new CharacterStoreClass();


export default class DemoRefluxComponent extends RefluxComponent {

    constructor(props) {
        super(props);

        this.state = {
            character: "",
            power: undefined
        };
        // Since we're extending RefluxComponent, we're now able to call some useful functions
        this.listenTo(CharacterStore, this.onStoreUpdate);
        this.listenTo(CharacterActions.fightCharacter, this.onFightCharacter);
    }

    onStoreUpdate = () => this.forceUpdate();
    onChangeCharacter = (e) => this.setState({ character: e.target.value });
    onFightCharacter = (power) => this.setState({ power : power });

    addCharacter = () => CharacterActions.createCharacter(this.state.character);
    fightCharacter = () => CharacterActions.fightCharacter(-10);

    render = () => (
        <div>
            <h1>Demo react-reflux-component</h1>
            <input type="text" value={this.state.character} onChange={this.onChangeCharacter}/>
            <br/>
            <br/>
            <button onClick={this.addCharacter}>Add new character</button>
            <button onClick={this.fightCharacter}>Fight character !</button>
            { this.state.power ? `Attack character with ${this.state.power}` : null }
            { CharacterStore.characters.map( (c) => <div key={c}>{c}</div> ) }
        </div>
    );
}